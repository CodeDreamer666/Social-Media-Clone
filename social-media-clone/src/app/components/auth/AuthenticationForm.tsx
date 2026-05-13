import InputWithLabel from "../shared/InputWithLabel";
import ButtonToLogin from "./ButtonToLogin";

type Field = {
    displayText: string,
    text: string,
    placeholder: string,
    type: string
}

type AuthenticationFormProps = {
    handleFormSubmission: () => void
    inputList: Field[],
    title: string,
    subHeading: string,
    textOne: string,
    textTwo: string,
    onClick: () => void,
    redirect: string
}

export default function AuthenticationForm({
    handleFormSubmission,
    inputList,
    title,
    subHeading,
    textOne,
    textTwo,
    onClick,
    redirect
}: AuthenticationFormProps) {
    const buttonToLoginList = ["facebook", "google", "discord"]

    return (
        <form
            action={handleFormSubmission}
            className="flex w-full max-w-md flex-col rounded-3xl border border-neutral-800 bg-neutral-900 p-8"
        >

            <div className="mb-8">
                <h1 className="text-3xl font-semibold text-white">
                    {title}
                </h1>

                <p className="mt-2 text-sm text-neutral-400">
                    {subHeading}
                </p>
            </div>

            {inputList.map(({ text, displayText, placeholder, type }) => {
                return (
                    <InputWithLabel
                        key={text}
                        displayText={displayText}
                        text={text}
                        type={type}
                        placeholder={placeholder}
                    />
                )
            })}

            <button
                type="submit"
                className="mt-6 h-11 rounded-xl bg-sky-500 text-sm font-medium text-white transition-colors duration-200 hover:bg-sky-400"
            >
                Submit
            </button>

            <div className="relative my-6 flex items-center">
                <div className="w-full border-t border-neutral-800" />

                <span className="mx-4 text-xs font-medium text-neutral-500">
                    OR
                </span>

                <div className="w-full border-t border-neutral-800" />
            </div>

            <div className="flex gap-3">
                {buttonToLoginList.map((provider) => {
                    return (
                        <ButtonToLogin
                            key={provider}
                            socialProvider={provider as "facebook" | "google" | "discord"}
                            redirect={redirect}
                        />
                    )
                })}
            </div>

            <p className="mt-8 text-center text-sm text-neutral-400">
                {textOne}
                <span
                    onClick={onClick}
                    className="ml-1 cursor-pointer text-white transition-colors duration-200 hover:text-neutral-300"
                >
                    {textTwo}
                </span>
            </p>

        </form>
    )
}
