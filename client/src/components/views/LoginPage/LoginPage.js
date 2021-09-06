// import Axios from 'axios';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../_actions/user_action';
import { withRouter } from 'react-router-dom';
function LoginPage(props) {
    // redux하는 부분
    const dispatch = useDispatch();

    const [Email, setEmail] = useState("") //여기 괄호에 있는 부분은 Email의 초기값을 정해주는 곳
    const [Password, setPassword] = useState("")

    //
    // email
    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value);
    }
    // pw
    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value);
    }
    // submit
    const onSubmitHandler = (event) => {
        event.preventDefault(); // 페이지 리프레쉬를 막아준다.

        let body = {
            email: Email,
            password: Password
        }

        dispatch(loginUser(body))
            .then(response => { // login성공하면 페이지 이동하게끔
               if(response.payload.loginSuccess){
                  props.history.push('/')  
              }
               else {
                alert("Error")
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
                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler}/>
                <br/>
                <button type="submit">
                    Login
                </button>
            </form>
        </div>
    )
}
// export default LoginPage
export default withRouter(LoginPage)
