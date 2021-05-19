import React,{ useEffect } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
// import { response } from 'express';

function LandingPage(props) {

    useEffect(() => {
        axios.get('/api/hello')
        .then(response=> { console.log(response) })
    }, [])

    const onClickHandler = () => {
        axios.get('/api/users/logout')
        .then(response => {
            if(response.data.success){
                props.history.push("/login") // history가 react-router-dom을 통해 사용한다.
            }else {
                alert("로그아웃이 실패했습니다.")
            }
        })
    }


    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            width: '100%', height: '100vh'
        }}>
            <h2>시작 페이지</h2>

            <button onClick={onClickHandler}>
                로그아웃
            </button>
        </div>
    )
}

export default withRouter(LandingPage)
