import "./index.css";
import { useEffect, useState, useRef } from "react";
import stepsJson from "./steps.json";
import { Comments, StepData, UploadFile } from "./types";
import { FaFileUpload } from "react-icons/fa";
import { FcOk } from "react-icons/fc";
import useIsElementVisible from "../../hooks/useIsElementVisible";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { TProject, TStages } from "@components/project/types";
import ProjectsService from "@services/projects";
import { useAuth } from "src/hooks/authContextProvider";
import { getProjectStatus } from "@utils/project-functions";

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
  const [comments, setComments] = useState<Comments[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  useEffect(() => {
    init();
  }, []);

  async function init() {
    if (!projectId) return

    const response = await projectsService.getProject<TProject>(projectId)

    if (response.status !== 200) return
   
    const project = response.data;

    setSteps(response.data.stages);

    const step = project.stages.find((step) => step.stageId === project.currentStage) ?? null;

    if (!step) return;

    changeStep(step);
    setProject(project);

    console.log(response.data);    
  }

  // Async Scroll
  useEffect(() => {
    if (isLastVisible) {
      loadMoreComments(10);
    }
  }, [isLastVisible]);

  const nextStep = (step_id: number) => {
    if (!project) return;

    const _step = steps.find((step) => step.stageId === step_id) ?? null;
    if (!_step || _step.stageId > project.currentStage) return;

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

    setComments([...step.comments]);
  };

  const handleUploadFile = (event: any, _file: UploadFile) => {
    if (event.cancelable) return;

    const file = event.target.files[0];

    if (file.size > 100000) {
      toast(`Very large file. ${file.size}/${100000}`, { type: "error" });
      return;
    }

    // add docx/Word
    const extensionMap: Record<string, string> = {
      pdf: "application/pdf",
      txt: "text/plain",
    };

    if (file.type !== extensionMap[_file.extension]) {
      toast(
        `Extension ${file.type} not supported - expected: ${_file.extension}`,
        { type: "error" }
      );
      return;
    }

    // TODO: send file to api
    console.log("send file", file);
  };

  const handleSubmitCommets = () => {
    const message = comment.trim();

    if (message.length <= 0) return;

    try {
      // TODO: send message to api

      setComment("");
      const newComments = {
        date: new Date().toISOString(),
        from: "Allyson",
        message,
      };
      setComments((prevComments) => [newComments, ...prevComments]);
      console.log("Send Messsage!", comment);
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
              <div className="files">
                {currentStage.attachments.map((file) => (

                  <div key={file.id} className="file mb-3">
                    <label htmlFor={`file-${file.id}`} className="form-label">
                      Tipo do arquivo (.{file.extension}) {file.send ? <FcOk className="mb-1" /> : ''}
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
                ))}
              </div>

              <div className="status-project">
                <span>Status: </span> <br />
                <p>
                  {project && currentStage.stageId === project.currentStage 
                    ? " Em andamento"
                    : currentStage.completed ? " Concluido" : " Indisponível"
                  }
                </p>
              </div>
            </section>

            <section className="comments-form">
              <h3>Comentários:</h3>

              <textarea
                id="comment"
                name="comment"
                rows={8}
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
                <p className="comment" key={index}>
                  <strong>{message.from}: </strong>
                  {message.message}
                </p>
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
