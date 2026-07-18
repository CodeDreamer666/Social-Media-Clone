"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "~/server/better-auth/client";
import NavigationLink from "./NavigationLink";
import { useQueryClient } from "@tanstack/react-query";

function HomeIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
      />
    </svg>
  );
}

function CreateIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m0-3-3-3m0 0-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75"
      />
    </svg>
  );
}

function SearchIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
      />
    </svg>
  );
}

function ProfileIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
    </svg>
  );
}

function ConnectionsIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.941 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.75l.001-.031m11.999.001a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.773m0 0a5.971 5.971 0 0 0-.941 3.197m0 0-.001.031c0 .225.012.447.037.666m11.963-.697.001.031c0 .225-.012.447-.037.666M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-18 0a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0Z"
      />
    </svg>
  );
}

function LoginIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
      />
    </svg>
  );
}

function LogoutIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
      />
    </svg>
  );
}

function BrandMark() {
  return (
    <div
      className={[
        "flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br",
        "from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20",
      ].join(" ")}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="white"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="white"
        className="size-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
        />
      </svg>
    </div>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: userSession } = authClient.useSession();

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(() => {
      setIsOpen(false);
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [pathname]);

  async function signOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          queryClient.clear();
          router.replace("/auth");
          router.refresh();
        },
      },
    });
  }

  return (
    <header>
      <nav className="fixed top-0 z-50 h-16 w-full border-b border-white/[0.06] bg-black/70 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <BrandMark />
            <h1 className="text-[15px] font-semibold tracking-tight text-white">
              Welcome,{" "}
              <span className="text-zinc-400">
                {userSession?.user.name ?? "Guest"}
              </span>
            </h1>
          </div>

          <ul className="hidden items-center gap-1">
            <NavigationLink
              icon={<HomeIcon />}
              path="/"
              displayText="Home"
              isMobile={false}
            />
            <NavigationLink
              icon={<CreateIcon />}
              path="/posts/create"
              displayText="Create"
              isMobile={false}
            />
            {userSession && (
              <NavigationLink
                icon={<SearchIcon />}
                path="/search"
                displayText="Search"
                isMobile={false}
              />
            )}
            <NavigationLink
              icon={<ProfileIcon />}
              path="/profile"
              displayText="Profile"
              isMobile={false}
            />
            {userSession && (
              <NavigationLink
                icon={<ConnectionsIcon />}
                path="/connections"
                displayText="Connections"
                isMobile={false}
              />
            )}
            {userSession ? (
              <button
                onClick={() => signOut()}
                className={[
                  "ml-1 flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5",
                  "text-[14px] font-medium text-zinc-400 transition-all duration-200",
                  "hover:bg-white/5 hover:text-white",
                ].join(" ")}
              >
                <LogoutIcon />
                Logout
              </button>
            ) : (
              <NavigationLink
                icon={<LoginIcon />}
                path="/auth"
                displayText="Login"
                isMobile={false}
              />
            )}
          </ul>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={[
              "flex h-9 w-9 cursor-pointer items-center justify-center rounded-full",
              "text-zinc-300 transition-colors duration-200 hover:bg-white/5",
              "hover:text-white",
            ].join(" ")}
            aria-label="Toggle Menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
              />
            </svg>
          </button>
        </div>
      </nav>

      <aside
        className={[
          "fixed top-0 left-0 z-99 h-screen w-72 border-r border-white/[0.06]",
          "bg-zinc-950/95 p-6 backdrop-blur-xl transition-transform duration-300",
          "ease-out lg:hidden",
        ].join(" ")}
        style={{
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        <div className="mb-8 flex items-center gap-2.5 px-2 pt-2">
          <BrandMark />
          <span className="text-[15px] font-semibold text-white">
            {userSession?.user.name ?? "Guest"}
          </span>
        </div>

        <ul className="flex flex-col gap-1">
          <NavigationLink
            icon={<HomeIcon />}
            path="/"
            displayText="Home"
            isMobile={true}
          />
          <NavigationLink
            icon={<CreateIcon />}
            path="/posts/create"
            displayText="Create"
            isMobile={true}
          />
          {userSession && (
            <NavigationLink
              icon={<SearchIcon />}
              path="/search"
              displayText="Search"
              isMobile={true}
            />
          )}
          <NavigationLink
            icon={<ProfileIcon />}
            path="/profile"
            displayText="Profile"
            isMobile={true}
          />
          {userSession && (
            <NavigationLink
              icon={<ConnectionsIcon className="size-6" />}
              path="/connections"
              displayText="Connections"
              isMobile={true}
            />
          )}

          <div className="my-2 h-px w-full bg-white/[0.06]" />

          {userSession ? (
            <button
              onClick={() => signOut()}
              className={[
                "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-[15px]",
                "font-medium text-red-400 transition-colors duration-200 hover:bg-red-500/10",
              ].join(" ")}
            >
              <LogoutIcon />
              Logout
            </button>
          ) : (
            <NavigationLink
              icon={<LoginIcon />}
              path="/auth"
              displayText="Login"
              isMobile={true}
            />
          )}
        </ul>
      </aside>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={[
          "fixed top-0 left-0 z-50 hidden h-screen w-[17rem] flex-col border-r",
          "border-white/10 bg-black/80 p-6 backdrop-blur-xl lg:flex",
        ].join(" ")}
      >
        <div className="flex items-center gap-2.5">
          <BrandMark />
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-zinc-500">Welcome</p>
            <p className="truncate text-[15px] font-semibold tracking-tight text-white">
              {userSession?.user.name ?? "Guest"}
            </p>
          </div>
        </div>

        <nav className="mt-10 flex flex-1 flex-col justify-between">
          <ul className="flex flex-col gap-2">
            <NavigationLink
              icon={<HomeIcon />}
              path="/"
              displayText="Home"
              isMobile={false}
              isSidebar
            />
            <NavigationLink
              icon={<CreateIcon />}
              path="/posts/create"
              displayText="Create"
              isMobile={false}
              isSidebar
            />
            {userSession && (
              <NavigationLink
                icon={<SearchIcon />}
                path="/search"
                displayText="Search"
                isMobile={false}
                isSidebar
              />
            )}
            <NavigationLink
              icon={<ProfileIcon />}
              path="/profile"
              displayText="Profile"
              isMobile={false}
              isSidebar
            />
            {userSession && (
              <NavigationLink
                icon={<ConnectionsIcon />}
                path="/connections"
                displayText="Connections"
                isMobile={false}
                isSidebar
              />
            )}
          </ul>

          <div className="border-t border-white/[0.06] pt-4">
            {userSession ? (
              <button
                onClick={() => signOut()}
                className={[
                  "flex w-full cursor-pointer items-center gap-3 rounded-2xl px-4 py-3",
                  "text-[15px] font-medium text-red-400 transition-colors duration-200",
                  "hover:bg-red-500/10",
                ].join(" ")}
              >
                <LogoutIcon />
                Logout
              </button>
            ) : (
              <NavigationLink
                icon={<LoginIcon />}
                path="/auth"
                displayText="Login"
                isMobile={false}
                isSidebar
              />
            )}
          </div>
        </nav>
      </aside>
    </header>
  );
}
