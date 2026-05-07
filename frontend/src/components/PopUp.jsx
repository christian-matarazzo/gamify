
import "../styles/PopUp.css"

export default function PopUp({onClose}) {
    return(
        <div className="overlay">
            <div className="popup">
                <h2>Welcome To The GAMIFY wold, world of KEYS</h2>
                <div className="d-flex justify-content-center">
                    <button onClick={onClose}><i className="bi bi-x-octagon"></i></button>
                </div>
            </div>
        </div>
    )
}