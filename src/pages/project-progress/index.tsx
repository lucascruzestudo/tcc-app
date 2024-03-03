import "./index.css";
import { useEffect, useState, useRef } from "react";
import stepsJson from "./steps.json";
import { Comments, StepData, UploadFile } from "./types";
import { FaFileUpload } from "react-icons/fa";
import { FcOk } from "react-icons/fc";
import useIsElementVisible from "../../hooks/useIsElementVisible";
import { toast } from "react-toastify";

const project = { id: "uuid", currentStep: 3 };

export function ProjectProgress() {
  // Async Scroll
  const lastRef = useRef(null);
  const isLastVisible = useIsElementVisible(lastRef.current);

  const [currentStep, setCurrentStep] = useState<StepData | null>(null);
  const [steps, setSteps] = useState<StepData[]>([]);
  const [endDate, setEndDate] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [comments, setComments] = useState<Comments[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  useEffect(() => {
    // TODO: Mock
    setSteps(stepsJson);

    const step = stepsJson.find((step) => step.step === project.currentStep) ?? null;

    if (!step) return;

    changeStep(step);
  }, []);

  // Async Scroll
  useEffect(() => {
    if (isLastVisible) {
      loadMoreComments(10);
    }
  }, [isLastVisible]);

  const nextStep = (step_id: number) => {
    const _step = steps.find((step) => step.step === step_id) ?? null;
    if (!_step || _step.step > project.currentStep) return;

    changeStep(_step);
  };

  const changeStep = (step: StepData) => {
    setCurrentStep(step);

    const date = new Date(step.end_date);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    setEndDate(`${day}/${month}/${year}`);

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
    if (isLoadingComments || !currentStep) return;

    setIsLoadingComments(true);

    try {
      const newComments = [...currentStep.comments];
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
          {steps.map(({ step, label }) => (
            <div key={`step-${step}`}>
              <button
                className={step === currentStep?.step ? "active-step" : ""}
                onClick={() => nextStep(step)}
              >
                {label}
              </button>
            </div>
          ))}
        </nav>

        {currentStep && (
          <>
            <section className="header">
              <div>
                <span>
                  Etapa: {currentStep.step} -
                  {currentStep.step === project.currentStep
                    ? " Em andamento"
                    : " Concluido"}
                </span>

                <div className="description mt-3">
                  <strong>Descrição da etapa: </strong>
                  <small>{currentStep.description}</small>
                </div>
              </div>

              <div>
                <span>Data de entrega:</span>
                <div className="project-end-date">{endDate}</div>
              </div>
            </section>
            
            {currentStep.upload_files.length > 0 &&
              <p className="title-upload-files">
                <FaFileUpload /> Faça upload dos seus documentos aqui:
              </p>
            }

            <section className="upload-files">
              <div className="files">
                {currentStep.upload_files.map((file) => (

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
                <p>{currentStep.status}</p>
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
              {!!currentStep.comments.length && <div ref={lastRef} />}
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
