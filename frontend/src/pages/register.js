import { useState, useContext } from "react";
import { CSSTransition } from "react-transition-group";
import { useRouter } from "next/router";
import api from "../services/api";
import ControlledInput from "../components/controlledInput";
import { Home } from "../icons";
import {
  nameValidator,
  emailValidator,
  passwordValidator,
  checkPasswordValidator,
} from "../utils/validators";
import {
  nameFormatter,
  emailFormatter,
  passwordFormatter,
} from "../utils/formatters";
import { UserContext } from "../components/context/context";

function validateField(fieldName, value) {
  switch (fieldName) {
    case "name":
      return nameValidator(value);
    case "email":
      return emailValidator(value);
    case "password":
      return passwordValidator(value);
    case "checkPassword":
      return checkPasswordValidator(value, formData.password);
    default:
      return null;
  }
}

export default function Register() {
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    checkPassword: "",
    errors: {
      name: null,
      email: null,
      password: null,
      checkPassword: null,
    },
  });

  const [successRegister, setSuccessRegister] = useState(false);
  const [errorRegister, setErrorRegister] = useState(null);
  const [loadingRegister, setLoadingRegister] = useState(false);
  const router = useRouter();

  function handleChange(fieldName, value) {
    const errors = { ...formData.errors };
    const error = validateField(fieldName, value);
    errors[fieldName] = error;
    setFormData({
      ...formData,
      [fieldName]: value,
      errors,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoadingRegister(true);

    if (
      Object.values(formData.errors).every((error) => error === null) &&
      Object.values(formData).every((value) => value !== "")
    ) {
      try {
        await api.post("/api/users/", formData);

        setErrorRegister(false);
        setSuccessRegister(true);
      } catch (e) {
        console.log(e.response);
        setErrorRegister(true);
        setSuccessRegister(false);
      } finally {
        setLoadingRegister(false);
      }
    } else {
      setLoadingRegister(false);
    }
  }

  if (user) {
    router.push("/collection");
    return null;
  } else if (successRegister) {
    router.push("/login");
  } else {
    return (
      <div className="pageFormContainer">
        <div className="pageLettering">
          <div className="pageLettering__heading">
            <div className="pageLettering__heading pageLettering__heading--secondary">
              Cadastre-se
            </div>
            <div className="pageLettering__heading pageLettering__heading--primary">
              E se divirta trocando figurinhas e fazendo novos amigos!
            </div>
          </div>
        </div>
        <div className="pageFormContainer__form">
          <form
            onSubmit={handleSubmit}
            className={errorRegister ? "form form--error" : "form"}
          >
            <ControlledInput
              placeholder="Nome"
              label="Nome"
              type="text"
              state={name}
              formatter={nameFormatter}
              setState={setName}
              error={errorName}
            />
            <ControlledInput
              placeholder="Email"
              label="Email"
              type="text"
              state={email}
              formatter={emailFormatter}
              setState={setEmail}
              error={errorEmail}
            />
            <ControlledInput
              placeholder="Senha"
              label="Senha"
              type="password"
              state={password}
              formatter={passwordFormatter}
              setState={setPassword}
              error={errorPassword}
            />
            <ControlledInput
              placeholder="Senha"
              label="Confirme sua senha"
              type="password"
              state={checkPassword}
              formatter={passwordFormatter}
              setState={setCheckPassword}
              error={errorCheckPassword}
            />
            <div className="form__btnBox form__btnBox--spaceBetween">
              <Home
                onClick={() => router.push("/")}
                className="form__homeBtn"
              />
              <CSSTransition
                in={loadingRegister}
                timeout={400}
                classNames="btnPrimary"
              >
                <button type="submit" className="btnPrimary">
                  <CSSTransition
                    in={loadingRegister}
                    timeout={400}
                    classNames="btnPrimary__text"
                  >
                    <p className="btnPrimary__text">Cadastrar-se</p>
                  </CSSTransition>
                  <CSSTransition
                    in={loadingRegister}
                    timeout={400}
                    classNames="btnPrimary__loading"
                    unmountOnExit
                  >
                    <div className="btnPrimary__loading">
                      <div className="loadingBox">
                        <div className="loadingBox__bar loadingBox__bar--1 loadingBox__bar--white"></div>
                        <div className="loadingBox__bar loadingBox__bar--2 loadingBox__bar--white"></div>
                        <div className="loadingBox__bar loadingBox__bar--3 loadingBox__bar--white"></div>
                      </div>
                    </div>
                  </CSSTransition>
                </button>
              </CSSTransition>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
