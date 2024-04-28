export function Spinner({ loading }: { loading: boolean }) {
    return (<>
        {loading &&
            <div className="d-flex justify-content-center mt-5 mb-3">
                <div className="spinner-border text-primary" role="status">
                </div>
            </div>
        }
    </>)
}