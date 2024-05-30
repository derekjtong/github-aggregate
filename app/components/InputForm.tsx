import { FormEvent } from "react";

interface InputFormProps {
  userName: string;
  setUserName: (userName: string) => void;
  handleSubmit: (e: FormEvent) => void;
  error: string;
  isLoading: boolean;
}

export default function InputForm({
  userName,
  setUserName,
  handleSubmit,
  error,
  isLoading,
}: InputFormProps) {
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full max-w-sm"
    >
      <label
        htmlFor="username"
        className="block text-sm font-medium text-gray-700"
      >
        User Name:
      </label>
      <input
        type="text"
        id="username"
        onChange={(e) => setUserName(e.target.value)}
        value={userName}
        className="border rounded p-2"
        aria-describedby="username-error"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Go"}
      </button>
      {error && (
        <div id="username-error" className="text-red-500">
          {error}
        </div>
      )}
    </form>
  );
}
