import { FormEvent } from "react";

interface InputFormProps {
  userName: string;
  setUserName: (userName: string) => void;
  handleSubmit: (e: FormEvent) => void;
  error: string;
}

export default function InputForm({
  userName,
  setUserName,
  handleSubmit,
  error,
}: InputFormProps) {
  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div>User Name:</div>
      <input
        type="text"
        onChange={(e) => setUserName(e.target.value)}
        value={userName}
      />
      <button type="submit">Go</button>
    </form>
  );
}
