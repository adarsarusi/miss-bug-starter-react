const { Link } = ReactRouterDOM

import { authService } from '../services/auth.service.js'
import { BugPreview } from './BugPreview.jsx'

export function BugList({ bugs, onRemoveBug, onEditBug }) {

    const loggedinUser = authService.getLoggedinUser()

    function isAllowed(bug) {
        if (!loggedinUser) return false
        if (!loggedinUser.isAdmin && loggedinUser._id !== bug.creator._id) return false

        return true
    }

    if (!bugs) return <div>Loading...</div>
    return <ul className="bug-list">
        {bugs.map(bug => (
            <li key={bug._id}>
                <BugPreview bug={bug} />
                <section className="actions">
                    <button><Link to={`/bug/${bug._id}`}>Details</Link></button>

                    {isAllowed(bug) && <React.Fragment>
                        <button onClick={() => onEditBug(bug)}>Edit</button>
                        <button onClick={() => onRemoveBug(bug._id)}>x</button>
                    </React.Fragment>}

                </section>
            </li>
        ))}
    </ul >
}
