import "./index.css";

export function Project() {

    function handleAccessProject(id: string): void {
        console.log(id);
    }

    return (
        <div className="container-project">
            <div className="header">
                <p>
                    <strong>Projeto: </strong>
                    Desenvolvimento de um Sistema de Recomendação para Bibliotecas Virtuais
                </p>
                <p>
                    <strong>Status: </strong>
                    Ativo
                </p>
            </div>

            <div className="body">
                <div className="members">
                    <p><strong>Integrantes: </strong></p>
                    <p>João Silva</p>
                    <p>Maria Oliveira</p>

                    <p className="mt-3"> <strong>Turma: </strong> TI2023</p>
                </div>

                <div className="detail-info">
                    <p> <strong>Data de Entrega: </strong> 15/02/2023</p>
                    <p> <strong>Horário: </strong>  10:30</p>
                    <button onClick={() => handleAccessProject('f7d4e510-783c-4a5c-8c7f-1423dfe91bcf')}>Acessar</button>
                </div>
            </div>

        </div>

    )
}
