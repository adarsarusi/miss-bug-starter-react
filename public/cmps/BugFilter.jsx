const { useState, useEffect } = React

export function BugFilter({ filterBy, onSetFilterBy, onSetFilterByDebounced, total }) {

    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

    const PAGE_SIZE = 3
    const maxPage = Math.ceil(total / PAGE_SIZE) - 1

    useEffect(() => {
        onSetFilterByDebounced(filterByToEdit)
    }, [filterByToEdit.txt, filterByToEdit.minSeverity])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value
                break

            case 'checkbox':
                value = target.checked
                break
        }

        if (field === 'sortDir' || field === 'createdAt') value = +value

        setFilterByToEdit(prevFilter => {
            const updated = { ...prevFilter, [field]: value, pageIdx: 0}

            if (field === 'sortBy' || field === 'sortDir' || field === 'createdAt') {
                onSetFilterBy(updated)
            }

            return updated
        })
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilterBy(filterByToEdit)
    }

    function onGetPage(dir) {
        setFilterByToEdit(prev => {
            const nextPage = prev.pageIdx + dir

            if (nextPage < 0) return prev
            if (nextPage > maxPage) return prev

            const updated = { ...prev, pageIdx: nextPage }

            onSetFilterBy(updated)

            return { ...prev, pageIdx: nextPage }
        })
    }

    function togglePagination() {
        setFilterByToEdit(prev => {
            const updated = { ...prev, paginationOn: !prev.paginationOn }

            onSetFilterBy(updated)

            return updated
        })
    }

    const { txt, minSeverity } = filterByToEdit
    return (
        <form className="bug-filter" onSubmit={onSubmitFilter}>
            <p>Filter</p>

            <button disabled={!filterBy.paginationOn} onClick={() => onGetPage(-1)}>-</button>
            <span>{filterBy.pageIdx}</span>
            <button disabled={!filterBy.paginationOn} onClick={() => onGetPage(1)}>+</button>
            <button onClick={togglePagination}>Toggle Pagination</button>

            <label htmlFor="txt">Text: </label>
            <input value={txt} onChange={handleChange} type="text" placeholder="Search title / desc." id="txt" name="txt" />

            <label htmlFor="minSeverity">Min Severity: </label>
            <input value={minSeverity || ''} onChange={handleChange} type="number" placeholder="By Min Severity" id="minSeverity" name="minSeverity" />

            <label htmlFor="sortBy">Sort By:</label>
            <select name="sortBy" value={filterByToEdit.sortBy} onChange={handleChange}>
                <option value="title">Title</option>
                <option value="severity">Severity</option>
                <option value="createdAt">Created At</option>
            </select>

            <label htmlFor="sortDir">Sort Dir:</label>
            <select name="sortDir" value={filterByToEdit.sortDir} onChange={handleChange}>
                <option value="1">Asc</option>
                <option value="-1">Desc</option>
            </select>

        </form>
    )
}