"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  SEARCH_QUERY_MAX_LENGTH,
  SEARCH_QUERY_MIN_LENGTH,
} from "~/lib/contentLimits";
import { getDisplayUsername } from "~/lib/userDisplay";
import { api } from "~/trpc/react";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const trimmedQuery = debouncedQuery.trim();
  const hasSearchQuery = trimmedQuery.length >= SEARCH_QUERY_MIN_LENGTH;

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [query]);

  const {
    data: accounts,
    isLoading,
    error,
    refetch,
  } = api.user.searchAccounts.useQuery(
    { query: debouncedQuery },
    { enabled: hasSearchQuery },
  );

  const results = accounts ?? [];
  const hasResults = results.length > 0;

  return (
    <div className="min-h-screen bg-black pb-10 lg:px-8 lg:py-8">
      <section className="mx-auto max-w-3xl px-4">
        <section className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Search
          </h1>
          <p className="mt-2 text-[13px] text-zinc-500">
            Find people by username or display name.
          </p>
        </section>

        <section
          className={[
            "rounded-3xl border border-white/[0.06] bg-zinc-900/60 p-6",
            "shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl",
          ].join(" ")}
        >
          <label
            htmlFor="account-search"
            className="text-[14px] font-medium text-white"
          >
            Account search
          </label>

          <input
            id="account-search"
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
            }}
            placeholder="Search accounts"
            maxLength={SEARCH_QUERY_MAX_LENGTH}
            aria-describedby="account-search-help"
            className={[
              "mt-3 h-12 w-full cursor-pointer rounded-2xl border border-white/[0.08] bg-black/40 px-4",
              "text-[15px] text-white transition-colors duration-200 outline-none",
              "placeholder:text-zinc-600 focus:border-blue-500/50",
            ].join(" ")}
          />

          <div className="mt-6">
            {!hasSearchQuery && (
              <div
                className={[
                  "rounded-2xl border border-white/[0.06] bg-black/30",
                  "px-5 py-8 text-center",
                ].join(" ")}
              >
                <p
                  id="account-search-help"
                  className="text-[14px] text-zinc-500"
                >
                  Enter at least {SEARCH_QUERY_MIN_LENGTH} characters to search
                  by username or display name.
                </p>
              </div>
            )}

            {hasSearchQuery && isLoading && !error && (
              <div
                className={[
                  "rounded-2xl border border-white/[0.06] bg-black/30",
                  "px-5 py-8 text-center",
                ].join(" ")}
              >
                <p className="text-[14px] text-zinc-500">
                  Searching accounts...
                </p>
              </div>
            )}

            {hasSearchQuery && error && (
              <div
                role="alert"
                className={[
                  "rounded-2xl border border-red-500/20 bg-red-500/5",
                  "px-5 py-8 text-center",
                ].join(" ")}
              >
                <p className="text-[14px] text-zinc-300">
                  Search is unavailable right now. Your query has been kept.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    void refetch();
                  }}
                  className="mt-4 min-h-11 rounded-full border border-white/10 bg-white/5 px-5 text-[14px] font-medium text-white hover:bg-white/10"
                >
                  Try again
                </button>
              </div>
            )}

            {hasSearchQuery && !isLoading && !error && !hasResults && (
              <div
                className={[
                  "rounded-2xl border border-white/[0.06] bg-black/30",
                  "px-5 py-8 text-center",
                ].join(" ")}
              >
                <p className="text-[14px] text-zinc-500">No accounts found.</p>
              </div>
            )}

            {hasSearchQuery && !isLoading && !error && hasResults && (
              <ul className="flex flex-col gap-3">
                {results.map((account) => (
                  <li
                    key={account.id}
                    className={[
                      "flex min-h-[9.5rem] rounded-2xl border border-white/[0.06]",
                      "bg-black/30 p-4 transition-colors duration-200",
                      "hover:border-white/[0.1]",
                    ].join(" ")}
                  >
                    <div
                      className={[
                        "flex w-full flex-col gap-4",
                        "sm:flex-row sm:items-center sm:justify-between",
                      ].join(" ")}
                    >
                      <Link
                        href={`/profile/${account.id}`}
                        className="group flex gap-3"
                      >
                        <div
                          className={[
                            "flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
                            "bg-gradient-to-br from-blue-500 to-indigo-600 text-lg",
                            "font-semibold text-white shadow-md shadow-blue-500/20",
                          ].join(" ")}
                        >
                          {account.name[0]?.toUpperCase()}
                        </div>

                        <div>
                          <h2
                            className={[
                              "text-[15px] font-semibold text-white",
                              "transition-colors duration-200 group-hover:text-blue-400",
                            ].join(" ")}
                          >
                            {account.name}
                          </h2>
                          <p className="text-[13px] text-zinc-500">
                            {getDisplayUsername(account)}
                          </p>
                          <p className="mt-1 text-[12px] text-zinc-500">
                            {account.isPublic
                              ? "Public profile"
                              : "Private profile"}
                          </p>
                        </div>
                      </Link>

                      <Link
                        href={`/profile/${account.id}`}
                        className={[
                          "flex h-10 cursor-pointer items-center justify-center rounded-full",
                          "bg-gradient-to-br from-blue-500 to-indigo-600 px-5",
                          "text-[14px] font-medium text-white shadow-md shadow-blue-500/20",
                          "transition-all duration-200 hover:brightness-110 active:scale-[0.99]",
                        ].join(" ")}
                      >
                        View profile
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </section>
    </div>
  );
}
