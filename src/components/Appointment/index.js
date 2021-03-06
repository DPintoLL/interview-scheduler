import React from "react";

import "./styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";
import useVisualMode from "../../hooks/useVisualMode";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const CONFIRM = "CONFIRM";
const SAVING = "SAVING";
const DELETING = "DELETING";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  const onAdd = () => transition(CREATE);
  const onCancel = () => back();
  const onDelete = () => transition(CONFIRM);

  //saveAppointment() (originally save()) is passed to Form as props and will be the event handler for onClick on the Save/Confirm button
  function saveAppointment(name, interviewer, operation) {
    const interview = {
      student: name,
      interviewer,
    };
    transition(SAVING);
    //id in bookInterview() refers to appointment id
    props
      .bookInterview(props.id, interview, operation)
      .then(() => transition(SHOW))
      .catch((error) => transition(ERROR_SAVE, true));
  }

  function deleteAppointment(event) {
    transition(DELETING, true);
    props
      .cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch(() => transition(ERROR_DELETE, true));
  }

  return (
    <article className="appointment" data-testid="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={onAdd} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => transition(CONFIRM)}
          onEdit={() => transition(EDIT)}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onSave={saveAppointment}
          onCancel={onCancel}
          operation="CREATE"
        />
      )}
      {mode === EDIT && (
        <Form
          name={props.interview.student}
          interviewer={props.interview.interviewer.id}
          interviewers={props.interviewers}
          onSave={saveAppointment}
          onCancel={onCancel}
          operation="EDIT"
        />
      )}
      {mode === SAVING && <Status message="Saving..." />}
      {mode === DELETING && <Status message="Deleting..." />}
      {mode === CONFIRM && (
        <Confirm
          message="Are you sure you would like to delete?"
          onConfirm={deleteAppointment}
          onCancel={onCancel}
        />
      )}
      {mode === ERROR_SAVE && (
        <Error message="Could not save appointment." onClose={onCancel} />
      )}
      {mode === ERROR_DELETE && (
        <Error message="Could not cancel appointment." onClose={onCancel} />
      )}
    </article>
  );
}
