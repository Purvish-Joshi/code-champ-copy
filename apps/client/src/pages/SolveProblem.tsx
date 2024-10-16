import { ProblemType, Submission } from "@repo/common/zod";
import { useEffect, useRef, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import CodeEditor from "../components/codeEditor";
import { ContainerSplitter } from "../components/containerSplitter";
import { PorblemPageHeader } from "../components/headers/problemPageHeader";
import { Navbar02 } from "../components/navbars/navbar02";
import { SideNavbar } from "../components/navbars/sideNavbar";
import MainWrapper from "../components/wrappers/mainWrapper";
import { idToLanguageMappings } from "../config/languageIdMppings";
import { formatDate } from "../helper/formatDate";
import { ProblemStore } from "../stores/problemStore";
import { AuthStore } from "../stores/authStore";
import { IoMdClose } from "react-icons/io";

export default function SolveProblem() {
    const problemStore = ProblemStore();
    const authStore = AuthStore();
    const navigate = useNavigate();
    const { id, nav1, nav2 } = useParams<{
        id: string;
        nav1: string;
        nav2: string;
    }>();
    const [leftWidth, setLeftWidth] = useState(50);
    const [activeNav1, setActiveNav1] = useState<string>(nav1 || "Problem");
    const [activeNav2, setActiveNav2] = useState<string>(nav2 || "Code");

    useEffect(() => {
        if (nav2 === "Result") setActiveNav2("Code");
        navigate(`/solve-problem/${id}/${activeNav1}/Code`);
    }, []);

    useEffect(() => {
        setActiveNav1(nav1 || "Problem");
    }, [nav1]);

    useEffect(() => {
        setActiveNav2(nav2 || "Code");
    }, [nav2]);

    useEffect(() => {
        if (!id) return;
        (async () => {
            await problemStore.getProblem(id, authStore.userProfile?.id || "");
        })();
    }, [id]);

    useEffect(() => {
        switch (nav1) {
            case "Problem":
                break;
            case "Solution":
                break;
            case "Discussion":
                break;
            case "Submissions":
                problemStore.getProblemSubmissions(id as string);
                break;
            default:
                break;
        }
    }, [nav1]);

    useEffect(() => {
        switch (activeNav2) {
            case "Code":
                break;
            case "Test Cases":
                break;
            case "Discussions":
                break;
            case "Submissions":
                break;
            default:
                break;
        }
    }, [nav2]);

    const problem = problemStore.onGoingProblems.find(problem => problem.id === id);

    return (
        <div className="SolveProblemPage">
            <SideNavbar />

            {problem && (
                <MainWrapper>
                    <PorblemPageHeader problemNumber={problem?.problemNumber} title={problem.title} />

                    <div className="w-full h-[calc(100vh-50px)] flex">
                        {/* Left container */}
                        <div
                            className="w-[50%] pt-2.5 pb-1.5 px-6 flex flex-col gap-2 overflow-y-auto no-scrollbar"
                            style={{ width: `${leftWidth}%` }}
                        >
                            <Navbar02
                                navs={["Problem", "Solution", "Discussion", "Submissions"]}
                                currentNav={activeNav1}
                                setCurrentNav={setActiveNav1}
                                baseRoute={`solve-problem/${id}/nav/${activeNav2}`}
                            />

                            {activeNav1 === "Problem" && <Problem problem={problem} />}
                            {activeNav1 === "Solution" && <div>Solution</div>}
                            {activeNav1 === "Discussion" && <div>Discussion</div>}
                            {activeNav1 === "Submissions" && <Submissions submissions={problem.submissions} />}
                        </div>

                        {/* Splitter */}
                        <ContainerSplitter setLeftWidth={setLeftWidth} />

                        {/* Right container */}
                        <div
                            className="border-red-600 flex-1 w-[50%] pt-2.5 pb-1.5 px-6 flex flex-col"
                            style={{ width: `${100 - leftWidth}%` }}
                        >
                            <Navbar02
                                navs={["Code", ...(problem.result ? ["Result"] : [])]}
                                currentNav={activeNav2}
                                setCurrentNav={setActiveNav2}
                                baseRoute={`solve-problem/${id}/${activeNav1}/nav`}
                            />

                            {activeNav2 === "Code" && (
                                // <div className="flex-1">
                                <CodeEditor
                                    problemId={problem.id}
                                    navToResult={() => {
                                        navigate(`/solve-problem/${id}/${activeNav1}/Result`);
                                    }}
                                />
                                // </div>
                            )}

                            {activeNav2 === "Result" && <Result problem={problem} />}
                        </div>
                    </div>
                </MainWrapper>
            )}

            {!problem && problemStore.skeletonLoading && "Skeleton loading ..."}
        </div>
    );
}

const Problem = ({ problem }: { problem: ProblemType }) => {
    return (
        <div>
            <h2 className="text-lg font-semibold pt-1 pb-2 -ml-1">Problem Statement</h2>
            <p className="text-justify pb-5">{problem.description}</p>
            {problem.exampleTestCases.map((example, index) => {
                return (
                    <div key={index} className="pb-5">
                        <h2 className="text-lg font-semibold pt-1 pb-2 -ml-1">Example {index + 1}</h2>

                        <div className="border-l-4 border-light300 dark:border-dark300 pl-4">
                            <div className="space-x-2 flex">
                                <span className="font-medium">Input: </span>
                                <span>
                                    {example.input.map((input, index) => (
                                        <div key={index}>
                                            <span>{input.name + " = "}</span>
                                            <span>{input.value}</span>
                                        </div>
                                    ))}
                                </span>
                            </div>
                            <div className="space-x-2">
                                <span className="font-medium">Output: </span>
                                <span>{example.output}</span>
                            </div>
                            <div className="space-x-2">
                                <span className="font-medium">Explanation: </span>
                                <span>{example.explanation}</span>
                            </div>
                        </div>
                    </div>
                );
            })}

            <h2 className="text-lg font-semibold pt-1 pb-2 -ml-1">Constraints</h2>
            <ul className="list-disc pl-5 pb-5">
                {problem.constraints.map((constraint, index) => (
                    <li key={index} className="text-justify pb-2">
                        {constraint}
                    </li>
                ))}
            </ul>
            <h2 className="text-lg font-semibold pt-1 pb-2 -ml-1">Topic Tags</h2>
            <ul className="flex gap-3 pb-5">
                {problem.topicTags.map((tag, index) => {
                    return (
                        <span
                            key={index}
                            className=" bg-light300 dark:bg-dark300 text-sm backdrop:blur-md px-2.5 py-0.5 pb-1 rounded-[100vh]"
                        >
                            {tag}
                        </span>
                    );
                })}
            </ul>
            <h2 className="text-lg font-semibold pt-1 pb-2 -ml-1">Hints</h2>
            <ul className=" pb-5">
                {problem.hints.map((hint, index) => (
                    <li key={index} className="text-justify pb-2 cursor-pointer">
                        <details>
                            <summary>Hint {index + 1}</summary>
                            <p className="py-0.5">{hint}</p>
                        </details>
                    </li>
                ))}
            </ul>
            <div className="flex items-center justify-start gap-4 mt-1 mb-4">
                <span className="text-lightText800 dark:text-darkText800 font-semibold">
                    Accepted{" "}
                    <span className="text-lightText900 dark:text-darkText900 font-normal">{problem.acceptedSubmissions}</span>
                </span>
                <span className="text-2xl text-lightText800 dark:text-darkText800 leading-[1px]">|</span>
                <span className="text-lightText800 dark:text-darkText800 font-semibold">
                    Submissions{" "}
                    <span className="text-lightText900 dark:text-darkText900 font-normal">{problem.submissionCount}</span>
                </span>
                <span className="text-2xl text-lightText800 dark:text-darkText800 leading-[1px]">|</span>
                <span className="text-lightText800 dark:text-darkText800 font-semibold">
                    Acceptance Rate{" "}
                    <span className="text-lightText900 dark:text-darkText900 font-normal">
                        {problem.acceptanceRate}
                        {" %"}
                    </span>
                </span>
            </div>
        </div>
    );
};

const Submissions = ({ submissions }: { submissions?: Submission[] }) => {
    const problemStore = ProblemStore();
    const [viewCode, setViewCode] = useState(false);
    const [viewCodeIndex, setViewCodeIndex] = useState<number>();

    return (
        <div className="h-full">
            {submissions?.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                    <div className="flex flex-col items-center justify-center gap-2">
                        <div className="text-lightText800 dark:text-darkText800 font-semibold text-lg">No Submissions</div>
                        <div className="text-lightText800 dark:text-darkText800 font-semibold text-sm">
                            You have not submitted any solutions yet.
                        </div>
                    </div>
                </div>
            ) : null}

            {!viewCode && submissions && (
                <table className="w-full">
                    <thead className="w-full border-b border-light300 dark:border-dark300">
                        <tr className="">
                            <th className="pb-2">Status</th>
                            <th className="pb-2">Points</th>
                            <th className="pb-2">Language</th>
                            <th className="pb-2">Code</th>
                            <th className="pb-2">Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {submissions &&
                            submissions.map((submission, index) => {
                                const date = new Date(submission.createdAt);
                                const string = date.toISOString();

                                return (
                                    <tr className="text-center opacity-80" key={index}>
                                        <td
                                            className={`pb-2 pt-3 font-semibold ${
                                                submission.status === "Accepted"
                                                    ? "text-green-500"
                                                    : //@ts-ignore
                                                      submission.status === "TimeLimitExceeded"
                                                      ? "text-red-500"
                                                      : //@ts-ignore
                                                        submission.status === "CompilationError"
                                                        ? "text-red-500"
                                                        : //@ts-ignore
                                                          submission.status === "RuntimeError"
                                                          ? "text-red-500"
                                                          : //@ts-ignore
                                                            submission.status === "Rejected"
                                                            ? "text-red-500"
                                                            : //@ts-ignore
                                                              submission.status === "Pending"
                                                              ? "text-yellow-500"
                                                              : ""
                                            }`}
                                        >
                                            {submission.status === "Accepted"
                                                ? "Accepted"
                                                : //@ts-ignore
                                                  submission.status === "TimeLimitExceeded"
                                                  ? "Time Limit Exceeded"
                                                  : //@ts-ignore
                                                    submission.status === "CompilationError"
                                                    ? "Compilation Error"
                                                    : //@ts-ignore
                                                      submission.status === "RunTimeError"
                                                      ? "Run Time Error"
                                                      : //@ts-ignore
                                                        submission.status === "Rejected"
                                                        ? "Rejected"
                                                        : //@ts-ignore
                                                          submission.status === "Pending"
                                                          ? "Pending"
                                                          : ""}
                                        </td>
                                        <td className="pb-2 pt-3">{0}</td>
                                        <td className="pb-2 pt-3">{idToLanguageMappings[parseInt(submission.languageId)]}</td>
                                        <td
                                            className="pb-2 pt-3 cursor-pointer underline"
                                            onClick={() => {
                                                setViewCode(true);
                                                setViewCodeIndex(index);
                                            }}
                                        >
                                            view
                                        </td>
                                        <td className="pb-2 pt-3">{formatDate(string)}</td>
                                    </tr>
                                );
                            })}{" "}
                    </tbody>{" "}
                </table>
            )}

            {submissions && viewCode && viewCodeIndex !== undefined && (
                <div className="w-full h-full">
                    <div className="flex items-center justify-between pb-6">
                        <span>Submitted Code</span>

                        <button type="button" className="text-3xl" onClick={() => setViewCode(false)}>
                            <IoMdClose />
                        </button>
                    </div>
                    <pre className="mx-4 h-[calc(100%-50px)] overflow-scroll no-scrollbar opacity-80">
                        {submissions[viewCodeIndex].code}
                    </pre>
                </div>
            )}

            {problemStore.skeletonLoading && !submissions && <div className="text-center">Loading...</div>}
        </div>
    );
};

const Result = ({ problem }: { problem: ProblemType }) => {
    const problemStore = ProblemStore();
    const resultRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (resultRef.current && problemStore.skeletonLoading) {
            resultRef.current.scrollTop = resultRef.current.scrollHeight;
        }
    }, [problem.result?.tasks?.length]);

    return (
        <div className="flex flex-col pt-2 h-[92%] mt-0.5">
            {problem.result && problem.result.tasks && (
                <div ref={resultRef} className="flex-1 overflow-scroll overflow-y-auto overflow-x-hidden no-scrollbar">
                    {problem.result.status === "compilation error" && (
                        <div>
                            <div className="text-red-600 text-center font-bold text-xl">Compilation Error</div>
                            <pre className="pt-6 text-red-500">{problem.result?.compilationError}</pre>
                        </div>
                    )}

                    {problem.result.status === "run time error" && (
                        <div className="text-red-600 text-center  font-bold text-xl mb-3">Run Time Error</div>
                    )}

                    {problem.result.status === "time limit exceeded" && (
                        <div className="text-red-600 text-center  font-bold text-xl mb-3">Time Limit Exceeded</div>
                    )}

                    {problem.result.tasks.map((testCase, index) => {
                        return (
                            <details
                                key={index}
                                className="flex flex-col gap-2 rounded-md mb-3 mr-6 bg-light300 dark:bg-dark300 group"
                            >
                                <summary
                                    className={`py-2 pl-3 pr-4 font-semibold cursor-pointer flex gap-3 justify-between items-center`}
                                >
                                    <div className="flex gap-3 w-full">
                                        <span className="px-1 ">{testCase.id + 1}</span>
                                        <span className={`px-1 ${testCase.accepted ? "text-green-500" : "text-red-500"}`}>
                                            {testCase.accepted ? "Accepted" : "Rejected"}
                                        </span>
                                        <span className="ml-auto w-[150px] font-normal text-gray-700 dark:text-gray-300">
                                            Runtime: {testCase.executionTime} ms
                                        </span>
                                    </div>
                                    <IoIosArrowForward className="transition-transform group-open:rotate-90" />
                                </summary>
                                <div
                                    className="px-4 py-2 border-t border-[#00000070] dark:border-[#ffffff70] mx-2 overflow-hidden"
                                    style={{ transition: "max-height 0.3s ease-in-out" }}
                                >
                                    <div className="space-x-2 flex">
                                        <span className="font-medium">Input: </span>
                                        <span className="max-h-[400px] overflow-hidden relative">
                                            {testCase.inputs.map((input, index) => (
                                                <div key={index}>
                                                    <span>{input.name + " = "}</span>
                                                    <span>{input.value}</span>
                                                </div>
                                            ))}
                                            {testCase.inputs.length > 0 && (
                                                <div
                                                    className="absolute bottom-0 right-0 bg-gradient-to-t from-light300 dark:from-dark300 to-transparent w-full h-20 flex items-end justify-end"
                                                    style={{
                                                        display: "none",
                                                        opacity: 0,
                                                        transition: "opacity 0.3s ease",
                                                    }}
                                                    ref={el => {
                                                        if (el) {
                                                            const parent = el.parentElement;
                                                            if (parent && parent.scrollHeight > parent.clientHeight) {
                                                                el.style.display = "flex";
                                                                setTimeout(() => {
                                                                    el.style.opacity = "1";
                                                                }, 0);
                                                            }
                                                        }
                                                    }}
                                                ></div>
                                            )}
                                        </span>
                                    </div>
                                    <div className="space-x-2">
                                        <span className="font-medium">Output: </span>
                                        <span>{testCase.output}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium">Expected Output: </span>
                                        <span>{testCase.expectedOutput}</span>
                                    </div>
                                </div>
                            </details>
                        );
                    })}
                    {problemStore.skeletonLoading && problem.result && <div className="text-center">executing...</div>}
                    {!problem.result && <div className="text-center">No Results</div>}
                </div>
            )}

            <div className="h-[30px]">
                {problem.result && (
                    <div className="flex gap-4">
                        <div className="py-2 font-semibold">
                            Test Cases:{" "}
                            <span className="font-normal">{`${problem.testCasesCount}/${problem.result?.tasks?.filter(t => t.status === "success")?.length || 0}`}</span>
                        </div>

                        {problem.result.status && (
                            <div className="py-2 font-semibold">
                                Status:{" "}
                                <span
                                    className={`${
                                        problem.result.status === "accepted"
                                            ? "text-green-500"
                                            : problem.result.status === "rejected"
                                              ? "text-red-500"
                                              : problem.result.status === "pending"
                                                ? "text-yellow-500"
                                                : problem.result.status === "compilation error"
                                                  ? "text-red-500"
                                                  : problem.result.status === "run time error"
                                                    ? "text-red-500"
                                                    : problem.result.status === "time limit exceeded"
                                                      ? "text-red-500"
                                                      : "text-gray-500"
                                    }`}
                                >
                                    {problem.result.status?.charAt(0).toUpperCase() + problem.result.status.slice(1)}
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
