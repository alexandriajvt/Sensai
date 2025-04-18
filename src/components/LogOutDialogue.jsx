import { useState } from 'react';
import {useNavigate} from 'react-router-dom'; 
import useSignOut from 'react-auth-kit/hooks/useSignOut';

function LogOutDialogue(){
    const [message] = useState('');
    const navigate = useNavigate();
    const signOut = useSignOut();

    const handleLogout = async () => {
        try{
            const response = await fetch('http://localhost:5001/api/auth/logout',{
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({message})
            })
            const data = await response.json();
            if (!response.ok) {
                console.error('Logout failed', data.error);
                return;
            }
            signOut(); //clears the auth data from storage (cookie/localStorage)
            console.log('Logged out successfully');//make sure after this, the user is actually logged out such that they should not be able to accessa ny other page except the logout page
            navigate('/login')
        }catch(err){
            console.error("log out failed for Dev check console.");
        }
    }
    return(
        <button 
                onClick={handleLogout}
                style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
                }}
            >
                Confirm Log Out
            </button>
    )
      
}
export default LogOutDialogue;