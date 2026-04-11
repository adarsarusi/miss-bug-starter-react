const { useState, useEffect } = React
const { Link, useParams, useNavigate } = ReactRouterDOM

import { formatDate } from "../services/util.service.js"
import { bugService } from '../services/bug.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'

export function BugDetails() {

    const [bug, setBug] = useState(null)
    const { bugId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        console.log('bugId:', bugId)

        bugService.getById(bugId)
            .then(bug => setBug(bug))
            .catch(err => {
                if (err.response && err.response.status === 401) {
                    showErrorMsg(`Wait for a bit`, err)
                    navigate('/bug') // go back to index
                } else{
                    showErrorMsg(`Cannot load bug`, err)
                }
            })
    }, [])

    return <div className="bug-details main-content">
        <h2>Bug Details</h2>
        {!bug && <p className="loading">Loading....</p>}
        {
            bug &&
            <div>
                <h3>{bug.title}</h3>
                <p className="severity">Severity: <span>{bug.severity}</span></p>
                <p className="createdAt">{formatDate(bug.createdAt, true)}</p>
                <p>Description: <span>{bug.description}</span></p>
            </div>
        }
        <button><Link to="/bug">Back to List</Link></button>
    </div>

}