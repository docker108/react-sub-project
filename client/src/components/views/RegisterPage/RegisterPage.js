import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../../_actions/user_action';
// import { withRouter } from 'react-router-dom';

function RegisterPage(props) {


    // redux하는 부분
    const dispatch = useDispatch();

    // uses치고 자동완성 기능 쓰면 편함
    const [Email, setEmail] = useState("") //여기 괄호에 있는 부분은 Email의 초기값을 정해주는 곳
    const [Password, setPassword] = useState("")
    const [Name, setName] = useState("")
    const [ConfirmPassword, setConfirmPassword] = useState("")


    // Email
    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value);
    }
    // Name
    const onNameHandler = (event) => {
        setName(event.currentTarget.value);
    }
    // Pw
    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value);
    }
    // ConfirmPw
    const onConfirmPasswordHandler = (event) => {
        setConfirmPassword(event.currentTarget.value);
    }
    // submit
    const onSubmitHandler = (event) => {
        event.preventDefault(); // 페이지 리프레쉬를 막아준다.

        if(Password !== ConfirmPassword){
            return alert('비밀번호와 비밀번호 확인이 같지 않습니다.')
        }

        let body = {
            email: Email,
            name: Name,
            password: Password
        }
        dispatch(registerUser(body))
            .then(response => { // 회원가입성공하면 로그인페이지로 이동하게끔
                if(response.payload.success){
                    props.history.push("/login")
                }
                else {
                    alert("Failed to sign up")
                }
          })
        }

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            width: '100%', height: '100vh'
            }}>
            <form style={{
                display:'flex', flexDirection:'column'
            }}
                onSubmit={onSubmitHandler}
            >
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler}/>

                <label>Name</label>
                <input type="text" value={Name} onChange={onNameHandler}/>

                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler}/>

                <label>ConfirmPassword</label>
                <input type="password" value={ConfirmPassword} onChange={onConfirmPasswordHandler}/>
                <br/>
                <button type="submit">
                    회원가입
                </button>
            </form>
        </div>
    )
}
export default RegisterPage

// export default withRouter(RegisterPage)
// Unhandled Rejection (TypeError): Cannot read property 'push' of undefined
// 오류가 나면 withRouter로 감싸주고 위에서 다시 임포트해주면 된다.
