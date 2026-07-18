"use client";

import LoadingIcon from "~/components/shared/LoadingIcon";
import type usePublicProfileConnection from "../hooks/usePublicProfileConnection";

type PublicProfileConnectionActionsProps = {
  userId: string;
  connection: ReturnType<typeof usePublicProfileConnection>;
};

export default function PublicProfileConnectionActions({
  userId,
  connection,
}: PublicProfileConnectionActionsProps) {
  const {
    buttonState,
    requestConnection,
    acceptConnectionRequest,
    rejectConnectionRequest,
    hasReceivedPendingRequest,
    hasSentPendingRequest,
    isConnected,
  } = connection;

  if (hasReceivedPendingRequest) {
    return (
      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={() => {
            acceptConnectionRequest.mutate({
              requestUserId: userId,
            });
          }}
          disabled={
            acceptConnectionRequest.isPending ||
            rejectConnectionRequest.isPending
          }
          className={[
            "flex h-11 w-full cursor-pointer items-center justify-center rounded-full",
            "bg-gradient-to-br from-blue-500 to-indigo-600 px-6",
            "text-[14px] font-medium text-white shadow-md shadow-blue-500/20",
            "transition-all duration-200 hover:brightness-110 active:scale-[0.99]",
            "disabled:cursor-not-allowed disabled:brightness-75",
          ].join(" ")}
        >
          Accept
        </button>

        <button
          type="button"
          onClick={() => {
            rejectConnectionRequest.mutate({
              requestUserId: userId,
            });
          }}
          disabled={
            acceptConnectionRequest.isPending ||
            rejectConnectionRequest.isPending
          }
          className={[
            "flex h-11 w-full cursor-pointer items-center justify-center rounded-full",
            "border border-white/[0.08] bg-white/5 px-6",
            "text-[14px] font-medium text-white transition-colors duration-200",
            "hover:bg-white/10 active:scale-[0.99]",
            "disabled:cursor-not-allowed disabled:opacity-70",
          ].join(" ")}
        >
          Decline
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        requestConnection.mutate({ responseUserId: userId });
      }}
      disabled={
        buttonState === "LOADING" || hasSentPendingRequest || isConnected
      }
      className={[
        "mt-5 flex h-11 w-full items-center justify-center rounded-full",
        "bg-gradient-to-br from-blue-500 to-indigo-600 px-6",
        "text-[14px] font-medium text-white shadow-md shadow-blue-500/20",
        "transition-all duration-200 active:scale-[0.99]",
        "disabled:cursor-not-allowed",
        !hasSentPendingRequest && !isConnected && buttonState === "IDLE"
          ? "cursor-pointer hover:brightness-110"
          : "cursor-not-allowed",
      ].join(" ")}
    >
      <div className="flex min-w-[150px] items-center justify-center gap-2 transition-all duration-200">
        {buttonState === "LOADING" ? (
          <>
            <LoadingIcon />
            <span>Sending request...</span>
          </>
        ) : buttonState === "SENT" ? (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 12.75 6 6 9-13.5"
              />
            </svg>
            <span>Request sent</span>
          </>
        ) : isConnected ? (
          <span>Connected</span>
        ) : hasSentPendingRequest ? (
          <span>Pending</span>
        ) : (
          <span>Connect</span>
        )}
      </div>
    </button>
  );
}
