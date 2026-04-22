const { useState, useEffect } = React
const { useParams, useNavigate } = ReactRouterDOM

import { userService } from './user.service.js'

export function UserDetails() {
    
    const [user, setUser] = useState(null)
    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        loadUser()
    }, [params.userId])

    function loadUser() {
        userService.getById(params.userId)
            .then(setUser)
            .catch(err => {
                console.log('err:', err)
                navigate('/')
            })
    }

    function onBack() {
        navigate('/bug')
    }

    if (!user) return <div>Loading...</div>

    return <section className="user-details">
        <h1>User {user.fullname}</h1>
        <pre>
            {JSON.stringify(user, null, 2)}
        </pre>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis distinctio nihil consectetur, ad temporibus autem magnam quae officiis libero eum.</p>
        <button onClick={onBack}>Back</button>
    </section>
}