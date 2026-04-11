import { formatDate } from "../services/util.service.js"

export function BugPreview({bug}) {
    return <article className="bug-preview">
        <p className="title">{bug.title}</p>
        <p>Severity: <span>{bug.severity}</span></p>
        <p className="time">{formatDate(bug.createdAt, false)}</p>
    </article>
}