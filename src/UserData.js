import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from 'oidc-react'


/**
 * Fetches user data from the API using the provided token.
 * @param {string} token - The access token to authenticate the request.
 * @returns {Promise} A Promise that resolves with the user data.
 */
const fetchUserData = async token => {
  return await axios.get(process.env.REACT_APP_API_USER, {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
}

// example api use with oidc-react access tokens and axios
export default function UserData () {

  // calling authenicator from oidc-react
  const auth = useAuth()

  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // fetching from /api/user endpoint with access token from oidc-react 'auth'
  const handleFetchUserData = async () => {
    if (!auth || !auth.userData) {
      setError(new Error('Authentication data not available.'))
      return
    }
    setUserData(null)
    setError(null)
    try {
      setLoading(true)
      const token = auth.userData.access_token
      const response = await fetchUserData(token)
      setUserData(response.data)
    } catch (err) {
      console.error('There was an error fetching the user data', err)
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  // hiding user data
  const handleHideUserData = () => {
    setUserData(null)
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div>
      <h2>/api/user API Example</h2>
      {/* fetch from api */}
      <button onClick={handleFetchUserData}>Fetch User Data</button>

       {/* if userData is not null show data and give ability to clear data  */}
      {userData && (
        <>
          <button onClick={handleHideUserData}>Hide User Data</button>
          <pre>{JSON.stringify(userData, null, 2)}</pre>
        </>
      )}
     {/* loading between request  */}
      {loading && <p>Loading...</p>}
    </div>
  )
}
