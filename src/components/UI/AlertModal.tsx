import React from "react";

interface AlertModalProps{
    title: string,
    description: string,
}
const AlertModal: React.FC<AlertModalProps> = ({title,description,children}) => {
    return (
        <div className="modal fade" id="exampleModal" tabIndex={1} aria-labelledby="deleteModal"
             aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="deleteModal">{title}</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">X
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="shadow-none">
                            <p className={"text-danger fs-4"}>
                                {description}
                            </p>
                        </div>
                    </div>
                    <div className="modal-footer">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AlertModal;