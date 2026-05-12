type InputProps = {
    displayText?: string;
    text: string;
    value?: string | number,
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    placeholder?: string;
    isReadOnly?: boolean;
}

export default function InputWithLabel({
    displayText,
    text,
    value,
    onChange,
    type = "text",
    placeholder = "",
    isReadOnly = false
}: InputProps) {
    return (
        <div className="mb-5">

            <div className="mb-2 flex items-center gap-1">
                <label
                    htmlFor={text}
                    className="text-sm font-medium text-neutral-200"
                >
                    {displayText}
                </label>

                <span className="text-red-500">
                    *
                </span>
            </div>

            <input
                autoComplete="off"
                required
                type={type}
                id={text}
                name={text}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                readOnly={isReadOnly}
                className="h-11 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 text-sm text-white outline-none transition-colors duration-200 placeholder:text-neutral-500 focus:border-sky-500"
            />

        </div>
    )
}
