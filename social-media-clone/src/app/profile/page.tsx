"use client"

export default function Profile() {
    return (
        <section className="px-4">
            <div className="flex flex-col items-center" >
                <div className="flex gap-2 items-center justify-between w-full">
                    <div className="flex gap-2 items-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-500 text-3xl font-semibold text-white">
                            EC
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold text-white">
                                Ethan Carter
                            </h2>
                            <div className="flex">
                                <p className="text-sm text-neutral-400">
                                    @ethanc
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-center">
                            <h3 className="text-xl font-semibold text-white">
                                248
                            </h3>

                            <p className="text-sm text-neutral-400">
                                Posts
                            </p>
                        </div>

                        <div className="text-center">
                            <h3 className="text-xl font-semibold text-white">
                                12.4K
                            </h3>

                            <p className="text-sm text-neutral-400">
                                Followers
                            </p>
                        </div>

                        <div className="text-center">
                            <h3 className="text-xl font-semibold text-white">
                                318
                            </h3>

                            <p className="text-sm text-neutral-400">
                                Following
                            </p>
                        </div>
                    </div>
                </div>

                <p className="mt-5 max-w-lg text-sm leading-7 text-neutral-300">
                    Building minimal full-stack applications with modern UI.
                    Focused on clean design, scalable systems, and smooth user experiences.
                </p>


                <div className="flex w-full gap-2 mt-8">
                    <button
                        className="h-11 w-full rounded-xl bg-sky-500 cursor-pointer px-6 text-sm font-medium text-white transition-colors duration-300 hover:bg-sky-400"
                    >
                        Edit Profile
                    </button>

                    <button
                        className="h-11 w-full rounded-xl bg-sky-500 cursor-pointer px-6 text-sm font-medium text-white transition-all duration-300 hover:bg-sky-400"
                    >
                        Follow
                    </button>
                </div>
            </div >

            <section className="mt-8">
                <h2 className="mb-4 text-2xl font-semibold text-white">
                    Posts
                </h2>

                <div className="flex flex-col gap-4">
                    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
                        <p className="text-sm leading-7 text-neutral-200">
                            Simplicity scales better than complexity when building products.
                        </p>
                    </div>
                    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
                        <p className="text-sm leading-7 text-neutral-200">
                            Apple-like interfaces are mostly about spacing, typography, and restraint.
                        </p>
                    </div>
                    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
                        <p className="text-sm leading-7 text-neutral-200">
                            Consistency in UI matters more than adding more animations.
                        </p>
                    </div>
                </div>
            </section >

        </section>
    )
}