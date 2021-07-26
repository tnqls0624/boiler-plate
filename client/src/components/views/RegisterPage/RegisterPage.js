import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {registerUser} from '../../../_action/user_action';

function RegisterPage(props) {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [ConfirmPassword, setConfirmPassword] = useState("")

    const onEmailHandler = (e) => {
        setEmail(e.currentTarget.value);
    }

    const onPasswordHandler = (e) => {
        setPassword(e.currentTarget.value);
    }

    const onNameHandler = (e) => {
        setName(e.currentTarget.value);
    }

    const onConfirmPasswordHandler = (e) => {
        setConfirmPassword(e.currentTarget.value);
    }

    const onSubmitHandler = (e) => {
        e.preventDefault();

        if(password !== ConfirmPassword){
            return alert('비밀번호와 비밀번호 확인은 같아야합니다.')
        }

        let body = {
            email:email,
            name:name,
            password: password,

        }
        dispatch(registerUser(body)).then(response => {
            if(response.payload.success){
                props.history.push('/login')
            }else{
                alert('회원가입 실패');
            }
        });
    }

    return (
        <div style={{display: 'flex', justifyContent:'center', alignItems:'center', width:'100%', height:'100vh'}} onSubmit={onSubmitHandler}>
            <form style={{display:'flex', flexDirection:'column'}}>
                <label>Email</label>
                <input type="email" value={email} onChange={onEmailHandler}></input>

                <label>Name</label>
                <input type="text" value={name} onChange={onNameHandler}></input>

                <label>Password</label>
                <input type="password" value={password} onChange={onPasswordHandler}></input>

                <label>Confirm Password</label>
                <input type="password" value={ConfirmPassword} onChange={onConfirmPasswordHandler}></input>
                <br></br>
                <button>
                    회원가입
                </button>
            </form>
        </div>
    )
}

export default RegisterPage
