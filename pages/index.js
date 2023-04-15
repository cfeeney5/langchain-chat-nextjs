import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import CircularProgress from "@mui/material/CircularProgress";
import { useRouter } from "next/router";
// import { PersonIcon } from "../icons/icons";

export default function Home() {
  const router = useRouter();
  const [userInput, setUserInput] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState("");
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [saleSummaryText, setSaleSummaryText] = useState("");
  const [userId, setUserId] = useState("");

  async function fetchSaleSummaries() {
    const response1 = await fetch("/api/salesData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const saleSummaryText = await response1.json();

    // Do something with saleSummaryText here
    setSaleSummaryText(saleSummaryText.result);
  }

  useEffect(() => {
    fetchSaleSummaries();
    setUserId(Math.random().toString(36).substring(2, 15));
  }, []);

  const questions = [
    "Ive a sick calf. What should I do?",
    "Whats Red Tractor Assurance?",
    "When is the TAMS 3 closing date?",
    "What sales are on today?",
    "What sheep sales are on tomorrow?",
    "How many sales are on today?",
    "Tell me a joke",
  ];

  useEffect(() => {
    setSuggestedQuestions(
      questions.sort(() => 0.5 - Math.random()).slice(0, 3)
    );
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(router.query);
    const myParam = params.get("location");
    if (myParam) {
      console.log(myParam);
      setUserLocation(myParam);
      // Do something with the value of myParam
    } else {
      console.log("No Location");
      setUserLocation("Ireland, England, Wales, Northern Ireland and Scotland");
    }
  }, [router.query]);

  const [messages, setMessages] = useState([
    {
      content: `Hello I'm Martha, your chatbot assistant for farmers in the UK and Ireland!. 
      ... Don't forget, this is a test run and a bit of fun as I do get some stuff wrong.`,
      role: "assistant",
    },
  ]);

  const messageListRef = useRef(null);
  const textAreaRef = useRef(null);

  // Auto scroll chat to bottom
  useEffect(() => {
    const messageList = messageListRef.current;
    messageList.scrollIntoView({ behavior: "smooth" });

    const lastMessage = messageList.lastElementChild;
    if (lastMessage) {
      lastMessage.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Focus on text field on load
  useEffect(() => {
    textAreaRef.current.focus();
  }, []);

  // Handle errors
  const handleError = () => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        content: "Oops! There seems to be an error. Please try again.",
        role: "assistant",
      },
    ]);
    setLoading(false);
    setUserInput("");
  };

  const handleSuggestedQuestion = async (e, question) => {
    console.log("Question1: " + question);
    setUserInput(question);

    setLoading(true);
    setMessages((prevMessages) => [
      ...prevMessages,
      { content: question, role: "user" },
    ]);

    // Send user question and history to API
    const response = await fetch("/api/assistant", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: messages,
        userId: userId,
        userInput: question,
        userLocation: userLocation,
        saleSummaryText: saleSummaryText,
      }),
    });

    if (!response.ok) {
      handleError();
      return;
    }

    // Reset user input
    setUserInput("");
    const data = await response.json();

    if (data.result.error === "Unauthorized") {
      handleError();
      return;
    }

    setMessages((prevMessages) => [
      ...prevMessages,
      { content: data.result.choices[0].message.content, role: "assistant" },
    ]);

    setLoading(false);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userInput.trim() === "") {
      return;
    }

    setLoading(true);
    setMessages((prevMessages) => [
      ...prevMessages,
      { content: userInput, role: "user" },
    ]);

    // Send user question and history to API
    const response = await fetch("/api/assistant", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: messages,
        userId: userId,
        userInput: userInput,
        userLocation: userLocation,
        saleSummaryText: saleSummaryText,
      }),
    });

    if (!response.ok) {
      handleError();
      return;
    }

    // Reset user input
    setUserInput("");
    const data = await response.json();

    if (data.result.error === "Unauthorized") {
      handleError();
      return;
    }

    setMessages((prevMessages) => [
      ...prevMessages,
      { content: data.result.choices[0].message.content, role: "assistant" },
    ]);

    setLoading(false);
  };

  // Prevent blank submissions and allow for multiline input
  const handleEnter = (e) => {
    if (e.key === "Enter" && userInput) {
      if (!e.shiftKey && userInput) {
        handleSubmit(e);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  // Keep history in sync with messages
  useEffect(() => {
    if (messages.length >= 3) {
      setHistory([
        [
          messages[messages.length - 2].content,
          messages[messages.length - 1].content,
        ],
      ]);
    }
  }, [messages]);

  return (
    <div className="parent">
      <Head>
        <title>Martha Chat</title>
        <meta name="description" content="Martha" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <div className={styles.topnav}>
        <div className={styles.navlogo}>
          <a href="https://www.marteye.ie">
            <Image
              src={"/marteye-logo-lockup_horz-white.png"}
              alt="MartEye Logo"
              width={113}
              height={20}
            />
          </a>
        </div>
      </div> */}
      <div className={styles.bannerWarning}>
        This is an Experimental Assistant and may produce inaccurate information
        about people, places, or facts.
      </div>
      <main className={styles.main}>
        <div className={styles.cloud}>
          <div ref={messageListRef} className={styles.messagelist}>
            {messages.map((message, index) => {
              return (
                // The latest message sent by the user will be animated while waiting for a response
                <div
                  key={index}
                  className={
                    message.role === "user" &&
                    loading &&
                    index === messages.length - 1
                      ? styles.usermessagewaiting
                      : message.role === "assistant"
                      ? styles.apimessage
                      : styles.usermessage
                  }
                >
                  {/* Display the correct icon depending on the message type */}
                  {message.role === "assistant" ? (
                    <Image
                      src="/martha.png"
                      alt="AI"
                      width="30"
                      height="30"
                      className={styles.boticon}
                      priority={true}
                    />
                  ) : (
                    // <PersonIcon width={30}></PersonIcon>
                    <Image
                      src="/bidavatar.png"
                      alt="Me"
                      width="30"
                      height="30"
                      className={styles.usericon}
                      priority={true}
                    />
                  )}
                  <div className={styles.markdownanswer}>
                    {/* Messages are being rendered in Markdown format */}
                    <ReactMarkdown linkTarget={"_blank"}>
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
              );
            })}

            {messages.length == 1 ? (
              <div className={styles.suggestedQuestion}>
                {messages.length === 1 &&
                  suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      className={styles.suggestedQuestionButton}
                      onClick={(e) => {
                        handleSuggestedQuestion(e, question);
                      }}
                    >
                      {question}
                    </button>
                  ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className={styles.cloudform}>
          {/* //some suggested questions are displayed above input field and when selected added to input field and sent */}

          <form onSubmit={handleSubmit}>
            <textarea
              disabled={loading}
              onKeyDown={handleEnter}
              ref={textAreaRef}
              autoFocus={false}
              rows={1}
              maxLength={512}
              type="text"
              id="userInput"
              name="userInput"
              placeholder={
                loading
                  ? "Waiting for response..."
                  : "Type your farming question..."
              }
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className={styles.textarea}
            />
            <button
              type="submit"
              disabled={loading}
              className={styles.generatebutton}
            >
              {loading ? (
                <div className={styles.loadingwheel}>
                  <CircularProgress color="inherit" size={20} />{" "}
                </div>
              ) : (
                // Send icon SVG in input field
                <svg
                  viewBox="0 0 20 20"
                  className={styles.svgicon}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                </svg>
              )}
            </button>
          </form>
        </div>
        {/* <div className={styles.center}>
          <div className={styles.footer}>
            <p>
              <a href="https://www.marteye.ie/privacy-policy" target="_blank">
                Privacy Policy
              </a>
            </p>
          </div>
        </div> */}
      </main>
    </div>
  );
}
