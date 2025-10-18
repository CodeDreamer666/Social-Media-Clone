export default function Form({ fields, onSubmit, formTitle }) {
    return (
        <form
            onSubmit={onSubmit}
            className="relative flex flex-col px-6 py-4 rounded-lg bg-white shadow-md hover:shadow-lg w-[90%] max-w-[500px] mx-auto transition-all duration-300">

            <h1 className="text-3xl font-bold mb-4 text-center">{formTitle}</h1>

            {fields.map(({ name, label, type, required, input, onChange, isTextarea, isReadonly = false }) => {
                if (isTextarea) {
                    return (
                        <div key={name} className="flex flex-col mb-6">
                            <label
                                htmlFor={name}
                                className="mb-1 font-semibold text-[22px]">{label}:
                            </label>
                            <textarea
                                value={input}
                                onChange={onChange}
                                className="text-[18px] px-2 py-1 border-2 border-black rounded-md"
                                id={name}
                                name={name}
                                required={required}
                                rows="8"
                            />
                        </div>
                    )
                } else {
                    return (
                        <div key={name} className="flex flex-col mb-6">
                            <label
                                htmlFor={name}
                                className="mb-1 font-semibold text-[22px]">{label}:
                            </label>
                            <input
                                value={input}
                                onChange={onChange}
                                className="text-[18px] px-2 py-1 border-2 border-black rounded-md"
                                id={name}
                                type={type}
                                name={name}
                                required={required}
                                readOnly={isReadonly}
                            />
                        </div>
                    )
                }
            })}

            <button
                type="submit"
                className="font-bold border-2 border-black rounded-md px-2 py-1 text-[18px] cursor-pointer mt-2 hover:bg-black hover:text-white transition-all duration-300">
                Submit
            </button>

        </form>
    )
}