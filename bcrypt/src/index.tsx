import { Form, ActionPanel, Action, showToast, Detail, Clipboard } from "@raycast/api";
import { useState } from "react";
var bcrypt = require('bcryptjs');

type Values = {
  text: string;
};

export default function Command() {
  const [stringError, setStringError] = useState<string | undefined>();
  async function handleSubmit(values: Values) {
    if (!isTextValid(values.text)) {
      setStringError("The field should't be empty!");
      return
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(values.text, salt);
    await Clipboard.copy(hash);
    showToast({ title: "Generated", message: "Hash saved to clipboard" });
  }

  function dropStringErrorIfNeeded() {
    if (stringError && stringError.length > 0) {
      setStringError(undefined);
    }
  }

  function isTextValid(text: string|undefined ){
    return text?.length != 0
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField 
        id="text" 
        title="Text" 
        placeholder="Enter string that you want to hash" 
        error={stringError}
        onChange={dropStringErrorIfNeeded}
        onBlur={(event) => {
          if (!isTextValid(event.target.value)) {
            setStringError("The field should't be empty!");
          } else {
            dropStringErrorIfNeeded();
          }
        }}
      />

    </Form>
  );
}
