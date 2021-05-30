//import {signUp} from "../components/login.js";
describe("settings ", () => {
document.body.innerHTML = `<form id="loginform">
<div class="container" style="display:block" id="page1">
    <h1><b>Login</b></h1>
    <hr>
    <input type="text" id="username" placeholder="Username" name="username" required>

    <input type="password" id="password" placeholder="Password" name="psw" required>

    <output class="error" name="loginError"></output>

    <!-- login/signup buttons -->
    <button type="submit" class="loginbtn">Login</button> <br><br>
    <button type="reset" class="signupbtn" onclick="signUp()">Sign Up</button>
    
    <!--***TESTING PURPOSES ONLY***-->
    <!--***DELETE AFTER LINKING TO MAIN PAGE***-->
    <button type="button" class="logout">Log Out (TEST ONLY)</button>
</div>
</form>`;
test("signup", () => {
    let loginbtn = document.getElementById("page1");
    expect(loginbtn.click()).toBeUndefined();
  });
});