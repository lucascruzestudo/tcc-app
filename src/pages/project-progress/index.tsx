import { TFile, TProject, TStages } from "@components/project/types";
import ProjectsService from "@services/projects";
import { formatFileName } from "@utils/project-functions";
import { useEffect, useRef, useState } from "react";
import { FaFileUpload } from "react-icons/fa";
import { FcOk } from "react-icons/fc";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "src/hooks/authContextProvider";
import useIsElementVisible from "../../hooks/useIsElementVisible";
import "./index.css";
import { Comment, UploadFile } from "./types";

export function ProjectProgress() {
  const { projectId } = useParams();
  const projectsService = new ProjectsService()
  const userLocalStorage = useAuth().user!

  // Async Scroll
  const lastRef = useRef(null);
  const isLastVisible = useIsElementVisible(lastRef.current);

  const [currentStage, setCurrentStage] = useState<TStages | null>(null);
  const [project, setProject] = useState<TProject | null>(null);
  const [steps, setSteps] = useState<TStages[]>([]);
  const [endDate, setEndDate] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  useEffect(() => {
    if (!currentStage) return
    getComment(currentStage.stageId);
  }, [currentStage]);

  useEffect(() => {
    init();
  }, []);

  // Async Scroll
  useEffect(() => {
    if (isLastVisible) {
      loadMoreComments(10);
    }
  }, [isLastVisible]);

  async function init() {
    if (!projectId) return

    const response = await projectsService.getProject<TProject>(projectId);

    if (response.status !== 200) return
   
    const project = response.data;
    
    setProject(project);
    setSteps(response.data.stages);

    const step = project.stages.find((step) => step.stageId === project.currentStage) ?? null;

    if (step) changeStep(step);
  }

  const getComment = async (stageId: number) => {
    if (!project) return;

    const response = await projectsService.getCommentsFromStage<Comment[]>(
      project._id, stageId
    );

    if (response.status === 200) {
      setComments(response.data)
    }
  }

  const nextStep = (step_id: number) => {
    if (!project) return;

    const _step = steps.find((step) => step.stageId === step_id) ?? null;
    if (!_step /*|| _step.stageId > project.currentStage*/) return;

    setComments([]);
    changeStep(_step);
  };

  const changeStep = (step: TStages) => {
    setCurrentStage(step);

    if (step.expectedCompletion) {
      const date = new Date(step.expectedCompletion);

      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();

      setEndDate(`${day}/${month}/${year}`);
    } else {
      setEndDate("Não definido!");
    }
  };

  const handleUploadFile = async (event: any, _file: UploadFile) => {
    if (event.cancelable) return;

    const file = event.target.files[0];

    const max_size_file = 100000 * 5

    if (file.size > max_size_file) {
      toast(`Very large file. ${file.size}/${100000}`, { type: "error" });
      event.target.value = null;
      return;
    }
    
    console.log("send file", file);

    const formData = new FormData()
    formData.append('file', file)

    const response = await projectsService.uploadProjectFile(
      project!._id, currentStage!.stageId, _file.id, formData
    );

    if (response.status !== 200) {
      toast(`Error no upload.`, { type: "error" });
      return;
    }

    //   {
    //     "description": "Esse é a PNG de Relatório Parcial!",
    //     "extension": "png",
    //     "file_path": "tmp/files/projects/660ebd9a892ba53ca5d14e1e/stage_1/Screenshot_from_2024-04-13_10-05-24.png",
    //     "filename": "Screenshot_from_2024-04-13_10-05-24.png",
    //     "id": "660ef9febeb5d68ab1b4d70d",
    //     "return_file_path": "tmp\\files\\projects\\660ebd9a892ba53ca5d14e1e\\stage_1\\logo.png"
    // }

  };

  const handleSubmitCommets = async () => {
    if (!project || !currentStage) return;

    const message = comment.trim();

    if (message.length <= 0) return;

    try {
      const response = await projectsService.sendNewCommentProject<Comment>(project._id, {
        message,
        stageId: currentStage?.stageId
      });

      if (response.status !== 201) {
        toast("Oppss... Ocorreu um erro ao enviar o comentário.", { type: "error" });
        return;
      }
      
      setComment("");
      setComments((prevComments) => [response.data, ...prevComments]);
    } catch (error) {
      console.error(error);
      toast("Erro ao enviar seu comentário.", { type: "error" });
    }
  };

  const loadMoreComments = (offset = 0, limit = 100) => {
    if (isLoadingComments || !currentStage) return;

    setIsLoadingComments(true);

    try {
      const newComments = [...currentStage.comments];
      setComments((prevComments) => [...prevComments, ...newComments]);
      console.log(
        `loading new comments with offset: ${offset} and limit: ${limit}`
      );
    } catch (error) {
      console.log(error);
      toast("Erro ao carregar mais comentários.", { type: "error" });
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleDownloadFile = async (file: TFile) => {
    const response = await projectsService.downloadProjectFile<BlobPart>(
      project!._id, currentStage!.stageId, file.id
    );

    if (response.status !== 200) {
      toast(`Error no upload.`, { type: "error" });
      return;
    }

    try {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', file.filename);
        document.body.appendChild(link);
        link.click();
        link.parentNode!.removeChild(link);
    } catch (error) {
        console.error('Error Download file:', error);
    }

  }

  return (
    <div className="container-home">
      <div className="steps">
        <nav className="menu-step">
          {steps.map(({ stageId, stageName }) => (
            <div key={`step-${stageId}`}>
              <button
                className={stageId === currentStage?.stageId ? "active-step" : ""}
                onClick={() => nextStep(stageId)}
              >
                {stageName}
              </button>
            </div>
          ))}
        </nav>

        {currentStage && (
          <>
            <section className="header">
              <div>
                <span>
                  Etapa: {currentStage.stageId} - {currentStage.stageName}
                </span>

                <div className="description mt-3">
                  <strong>Descrição da etapa: </strong>
                  <small>{currentStage.description}</small>
                </div>
              </div>

              <div>
                <span>Data de entrega:</span>
                <div className="project-end-date">{endDate}</div>
              </div>
            </section>
            
            {currentStage.attachments.length > 0 &&
              <p className="title-upload-files">
                <FaFileUpload /> Faça upload dos seus documentos aqui:
              </p>
            }

            <section className="upload-files">
                {currentStage.attachments.map((file) => (
                  <>
                    <div key={file.id} className="file row">
                      <div className="col-4 info-file">
                        <div className="">
                          <label htmlFor={`file-${file.id}`} className="form-label">
                            Tipo do arquivo (.{file.extension}) {file.filename ? <FcOk className="mb-1" /> : ''}
                          </label>

                          <input
                            className="form-control"
                            type="file"
                            name={`file-${file.id}`}
                            id={`file-${file.id}`}
                            accept={`.${file.extension}`}
                            onChange={(event) => handleUploadFile(event, file)}
                          />
                        </div>
                      </div>

                      <div className="col-4 info-file">
                        <div className="attachment">
                          <div><strong>Upload do Aluno: </strong></div>
                          <div>
                            <button 
                              onClick={() => handleDownloadFile(file)} 
                              type="button" 
                              className="btn btn-link p-0"
                            >
                              {formatFileName(file.filename, 29)}
                            </button>
                          </div> 
                        </div>
                      </div>

                      <div className="col-4 info-file">
                        <div className="attachment">
                          {file.return_file_path && (<>
                            <div>
                              <strong>Retorno do avaliador: </strong>
                            </div>
                            <div>
                              <button 
                              onClick={() => handleDownloadFile(file)} 
                              type="button" 
                              className="btn btn-link p-0"
                            >
                              {formatFileName(file.filename, 25)}
                            </button> 
                            </div>
                          </>)}
                        </div>
                      </div>

                    </div>
                    <hr />
                  </>
                ))}
            </section>

            <section className="comments-form">
              <h3>Comentários:</h3>

              <textarea
                id="comment"
                name="comment"
                rows={4}
                cols={80}
                placeholder="Faça seu comentário!"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
              <button
                className="mt-3 btn btn-primary"
                type="button"
                onClick={handleSubmitCommets}
              >
                Enviar
              </button>
            </section>

            <section className="comments">
              {comments.map((message, index) => (
                <div className="d-flex" key={message._id}>
                  <p
                    className={`
                      ${message.user_id === userLocalStorage.id 
                      ? 'my-comment' 
                      : 'team-comment'}`
                    } 
                    key={index}
                  >
                    <strong>{message.full_name}: </strong>
                    {message.comment}
                  </p>
                </div>
              ))}
              {!!currentStage.comments.length && <div ref={lastRef} />}
            </section>

            {isLoadingComments && (
              <p className="moreComments">Carregando mais comentários...</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
