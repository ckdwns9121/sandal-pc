import React from 'react';
import {Paths} from 'paths';
import {Signin,SignUp,SignupComplete,Recovery,RecoveryId,RecoveryPw} from 'pages';
import {Home,Account,Address,Reserve,DetailMenu} from 'pages';
import {Cart} from 'pages';
import {Route,Switch} from 'react-router-dom';

function App() {
  console.log(Paths.ajoonamu.complete);
  console.log("/complete/:name");
  return (
    <div className="App">
      <Route exact={true}path={Paths.index} component={Home}></Route>
      <Route path={Paths.ajoonamu.signin} component={Signin}></Route>
      <Route path={Paths.ajoonamu.signup} component={SignUp}></Route>
      <Route path={`${Paths.ajoonamu.complete}/:name`} component={SignupComplete}></Route>
      <Route path={Paths.ajoonamu.recovery} component={Recovery}></Route>
      <Route path={Paths.ajoonamu.recovery_id}  component={RecoveryId}></Route>
      <Route path={Paths.ajoonamu.recovery_pw} component={RecoveryPw}></Route>
      <Route path={Paths.ajoonamu.account}component={Account}></Route>
      <Route path={Paths.ajoonamu.address} component={Address} ></Route>
      <Switch>
        {/* ? 붙이면 없어도 되는 밸류*/}
        {/* 디테일 메뉴는 어떤 값을 넣어줄지 생각해야함*/}
      {/* <Route path="/reserve/:tab/:value/:data" exact component={Detail}></Route>  */}
      <Route path={`${Paths.ajoonamu.reserve}/:tab/:value/:data?`} exact component={DetailMenu}></Route>
      <Route path={`${Paths.ajoonamu.reserve}/:tab?`} component={Reserve}></Route>
      <Route path={`${Paths.ajoonamu.cart}`} component={Cart}></Route>
      </Switch>
    </div>
  );
}

export default App;
