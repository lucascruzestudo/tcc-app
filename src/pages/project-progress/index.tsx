import { Spinner } from "@components/index";
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
  const [newCommentLoading, setNewCommentLoading] = useState(false);
  const [loading, setloading] = useState<boolean>(false);

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

    setloading(true);

    const response = await projectsService.getProject<TProject>(projectId);

    setloading(false);

    if (response.status !== 200) return

    let project = response.data;

    project = {
      ...project,
      currentStage: project.currentStage > project.stages.length ? project.stages.length : project.currentStage
    }

    setProject(project);
    setSteps(response.data.stages);

    const step = project.stages.find((step) => step.stageId === project.currentStage) ?? null;

    if (step) changeStep(step);
  }

  const canUserUpload = (): boolean => {
    if (!currentStage || !project) return true

    if (userLocalStorage.role === 3 && currentStage.stageId > 2) return true

    if (currentStage.stageId !== project.currentStage) return true

    return false
  }


  const canUserAddComments = (): boolean => {
    if (!currentStage || !project) return true

    if (currentStage.stageId !== project.currentStage) return true

    return false
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
    // || _step.stageId > project.currentStage
    if (!_step) return;

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

    setComment('');
  };

  const handleUploadFile = async (event: any, _file: UploadFile) => {
    if (!project || !currentStage || event.cancelable) return;

    if (userLocalStorage.role === 3 && currentStage.stageId > 2) return;

    const file = event.target.files[0];

    const max_size_file = 850 * 1024 * 1024

    if (file.size > max_size_file) {
      toast(`Very large file. ${file.size}/${100000}`, { type: "error" });
      event.target.value = null;
      return;
    }

    const formData = new FormData()
    formData.append('file', file);

    const file_type = userLocalStorage.role === 3 ? 1 : 2

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
    if (!project || !currentStage || newCommentLoading) return;

    const message = comment.trim();

    if (message.length <= 0) return;

    setNewCommentLoading(true);

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
    } finally {
      setNewCommentLoading(false);
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

    let filename = null

    if (file_type === 1) filename = file.filename
    if (file_type === 2) filename = file.return_filename

    if (filename === null) return

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

  const canApproveStage = () => {
    if (!currentStage || !project || currentStage.stageId > project.currentStage) return false
    if (userLocalStorage.role === 1) return true
    if (userLocalStorage.role === 3) return false

    if (currentStage.stageId > 2) return false
    else return true
  }

  const handleApproveStage = async () => {
    if (!projectId || !project || !currentStage) return;

    if (project.currentStage !== currentStage.stageId) {
      toast(`Ainda não é possivel aprovar essa etapa do projeto.`, { type: "error" });
      return
    }

    const response = await projectsService.proceedStage(projectId);

    if (response.status != 200) {
      toast(response.msg || `Error ao aprovar etapa atual.`, { type: "error" });
      return
    }

    init();
  }

  const handleRevertStage = async (stageId: number) => {
    if (!projectId || !currentStage || stageId < 1) return;

    const response = await projectsService.revertStage(projectId, stageId);

    if (response.status != 200) {
      toast(response.msg || `Error ao revogar etapa atual.`, { type: "error" });
      return
    }

    init();
  }

  return (
    <div className="container-home">
      <Spinner loading={loading} />

      <div className="steps">
        {currentStage && project && (
          <>
            <nav className="menu-step">
              {steps.map(({ stageId, stageName }) => (
                <button
                  key={`step-${stageId}`}
                  className={stageId === currentStage?.stageId ? "active-step" : ""}
                  onClick={() => nextStep(stageId)}
                  data-bs-toggle="tooltip"
                  data-bs-placement="left"
                  title={project.currentStage === stageId ? 'Fase Atual' : 'Fase não disponivel'}
                >
                  {stageName}
                </button>
              ))}

              <div
                data-bs-toggle="tooltip"
                data-bs-placement="left"
                title="Fase final entre Orientador e Coordenador."
              >
                <button
                  disabled={true}
                  className="btn btn-secondary"
                >
                  Entrega Final Corrigida
                </button>
              </div>

            </nav>

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
                        disabled={canUserUpload()}
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
                // disabled={currentStage ? currentStage.stageId !== project.currentStage : true}
                id="comment"
                name="comment"
                rows={4}
                cols={80}
                placeholder="Faça seu comentário!"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
              <button
                disabled={canUserAddComments()}
                className="mt-3 btn btn-primary"
                type="button"
                onClick={handleSubmitCommets}
              >
                {newCommentLoading
                  ? (<>
                    <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                    <span> Enviando...</span>
                  </>)
                  : <span>Enviar</span>
                }
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

        {currentStage && canApproveStage() &&
          <div className="approve-stage">
            {(currentStage.completed || false) && currentStage.stageId
              ?
              <button
                onClick={() => handleRevertStage(currentStage.stageId)}
                type="button"
                className="btn btn-secondary"
              >
                Volta para essa Etapa
              </button>
              :
              <button
                onClick={handleApproveStage}
                type="button"
                className="btn btn-success"
              >
                Aprovar Etapa
              </button>
            }
          </div>
        }

      </div>

    </div>
  );
}
