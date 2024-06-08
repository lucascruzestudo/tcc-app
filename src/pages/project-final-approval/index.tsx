import { Spinner } from "@components/index";
import { TFile, TProject, TStages } from "@components/project/types";
import ProjectsService from "@services/projects";
import { formatFileName } from "@utils/project-functions";
import { useEffect, useRef, useState } from "react";
import { FaFileUpload } from "react-icons/fa";
import { FcOk } from "react-icons/fc";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "src/hooks/authContextProvider";
import useIsElementVisible from "../../hooks/useIsElementVisible";
import "./index.css";
import { Comment, UploadFile } from "./types";

export function ProjectProgressFinalApproval() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const projectsService = new ProjectsService()
  const userLocalStorage = useAuth().user!

  // Async Scroll
  const lastRef = useRef(null);
  const isLastVisible = useIsElementVisible(lastRef.current);

  const [currentStage, setCurrentStage] = useState<TStages | null>(null);
  const [project, setProject] = useState<TProject | null>(null);
  const [endDate, setEndDate] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [loading, setloading] = useState<boolean>(false);

  useEffect(() => {
    if (!currentStage) return
    getComment(currentStage.stageId);
  }, [currentStage]);

  useEffect(() => {
    if (userLocalStorage.role === 3) {
      navigate('/not-found');
    } else {
      init();
    }
  }, []);

  // Async Scroll
  useEffect(() => {
    if (isLastVisible) {
      loadMoreComments(10);
    }
  }, [isLastVisible]);

  async function init() {
    if (!projectId) return

    setloading(true);

    const response = await projectsService.getProject<TProject>(
      projectId, { include_final_stage: true, pending_final_approval: true }
    );

    if (response.status !== 200) return

    const project = response.data;

    if (project.currentStage !== project.stages.length) {
      toast(`Projeto não está na última Etapa.`, { type: "error" });
      navigate('/projects/final-approval');
      return
    }

    setProject(project);

    const step = project.stages.find((step) => step.stageId === project.currentStage) ?? null;

    if (step) changeStep(step);

    setloading(false);
  }

  const getComment = async (stageId: number) => {
    if (!project) return;

    const response = await projectsService.getCommentsFromStage<Comment[]>(
      project._id, stageId
    );

    if (response.status === 200 && response.data.length > 0) {
      setComments(response.data)
    }
  }

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
    if (!project || !currentStage || event.cancelable || userLocalStorage.role === 3) return;

    const file = event.target.files[0];

    const max_size_file = 100000 * 5

    if (file.size > max_size_file) {
      toast(`Very large file. ${file.size}/${100000}`, { type: "error" });
      event.target.value = null;
      return;
    }

    const formData = new FormData()
    formData.append('file', file)

    const file_type = userLocalStorage.role === 2 ? 1 : 2

    const response = await projectsService.uploadProjectFile<TFile>(
      project._id, currentStage.stageId, _file.id, file_type, formData
    );

    if (response.status !== 200) {
      toast(response.msg || `Error no upload.`, { type: "error" });
      return;
    }

    const newAttachments = currentStage.attachments.map((att) => {
      if (att.id === response.data.id) return response.data
      return att
    })

    const _stage = { ...currentStage, attachments: newAttachments }

    setCurrentStage(_stage);

    const _stages = project.stages.map((stg) => {
      if (stg.stageId === _stage.stageId) return _stage
      return stg
    });

    setProject({ ...project, stages: _stages });
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
        toast(response.msg || "Oppss... Ocorreu um erro ao enviar o comentário.", { type: "error" });
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

  const handleDownloadFile = async (file: TFile, file_type: 1 | 2) => {
    const response = await projectsService.downloadProjectFile<BlobPart>(
      project!._id, currentStage!.stageId, file.id, { file_type }
    );

    if (response.status !== 200) {
      toast(response.msg || `Error no upload.`, { type: "error" });
      return;
    }

    const filename = file_type ? file.return_filename : file.filename

    try {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode!.removeChild(link);
      console.log('OPA');
    } catch (error) {
      console.error('Error Download file:', error);
    }

  }

  const handleApproveProject = async () => {
    if (!projectId || !currentStage || !project || project.currentStage !== project.stages.length) return;

    const response = await projectsService.completedProject(projectId);

    if (response.status != 200 && response.data) {
      toast(response.msg || `Error ao aprovar etapa atual.`, { type: "error" });
      return
    }

    if (!project.completed) {
      toast(`Projeto aprovado com sucesso!`, { type: "success" });
    }

    init();
  }

  return (
    <div className="container-step-final">
      <Spinner loading={loading} />

      <div className="step-final">
        {currentStage && (
          <>
            <hr />
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
              {currentStage.attachments.map((file, index) => (
                <div key={index}>
                  <div key={file.id} className="files">
                    <div className="attachment upload-area">
                      <label htmlFor={`file-${file.id}`} className="form-label">
                        Tipo do arquivo (.{file.extension}) {file.filename ? <FcOk title="Upload feito" className="mb-1" /> : ''}
                      </label>

                      <input
                        disabled={currentStage?.completed || false}
                        className="form-control"
                        type="file"
                        name={`file-${file.id}`}
                        id={`file-${file.id}`}
                        accept={`.${file.extension}`}
                        onChange={(event) => handleUploadFile(event, file)}
                      />
                    </div>

                    <div className="attachment">
                      {file.file_path && (<>
                        <div className="pt-1 pb-2">Por {file.origin_name || 'Anônimo'}: </div>
                        <div>
                          <button
                            onClick={() => handleDownloadFile(file, 1)}
                            type="button"
                            className="btn btn-link p-0"
                          >
                            {formatFileName(file.filename, 25)}
                          </button>
                        </div>
                      </>)}
                    </div>

                    <div className="attachment">
                      {file.return_file_path && (<>
                        <div className="pt-1 pb-2">Por {file.return_origin_name || 'Anônimo'}: </div>
                        <div>
                          <button
                            onClick={() => handleDownloadFile(file, 2)}
                            type="button"
                            className="btn btn-link p-0"
                          >
                            {formatFileName(file.return_filename, 25)}
                          </button>
                        </div>
                      </>)}
                    </div>
                  </div>
                  <hr className="p-3" />
                </div>
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
                disabled={currentStage?.completed || false}
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

        {userLocalStorage.role === 1 && project &&
          <div className="approve-stage">
            <button
              onClick={handleApproveProject}
              type="button"
              className={`btn btn-${project.completed ? 'secondary' : 'success'}`}
            >
              {project.completed ? 'Revogar Aprovação' : 'Aprovar Projeto'}
            </button>
          </div>
        }

      </div>
    </div>
  );
}
