import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {loginUser} from '../../../_action/user_action';
import {withRouter} from 'react-router-dom';
function LoginPage(props) {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")

    const onEmailHandler = (e) => {
        setEmail(e.currentTarget.value);
    }

    const onPasswordHandler = (e) => {
        setPassword(e.currentTarget.value);
    }

    const onSubmitHandler = (e) => {
        e.preventDefault();

        let body = {
            email:email,
            password: password
        }
        dispatch(loginUser(body)).then(response => {
            if(response.payload.loginSuccess){
                props.history.push("/");
            }else{alert('Error')}
        });
    }
    
    return (
        <div style={{display: 'flex', justifyContent:'center', alignItems:'center', width:'100%', height:'100vh'}} onSubmit={onSubmitHandler}>
            <form style={{display:'flex', flexDirection:'column'}}>
                <label>Email</label>
                <input type="email" value={email} onChange={onEmailHandler}></input>
                <label>Password</label>
                <input type="password" value={password} onChange={onPasswordHandler}></input>
                <br></br>
                <button>
                    Login
                </button>
            </form>
        </div>
    )
}

export default withRouter(LoginPage);