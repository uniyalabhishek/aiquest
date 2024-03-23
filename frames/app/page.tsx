import {
  FrameButton,
  FrameContainer,
  FrameImage,
  FrameInput,
  FrameReducer,
  NextServerPageProps,
  getFrameMessage,
  getPreviousFrame,
  useFramesReducer,
} from "frames.js/next/server";
import Link from "next/link";
import { currentURL } from "./utils";
import { DEFAULT_DEBUGGER_HUB_URL, createDebugUrl } from "./debug";

type State = {
  messages: string[];
};

const initialState: State = { messages: [] };

// This is a react server component only
export default async function Home({ searchParams }: NextServerPageProps) {
  const url = currentURL("/examples/transaction");
  const previousFrame = getPreviousFrame<State>(searchParams);

  // const [state] = useFramesReducer<State>(reducer, initialState, previousFrame);

  const frameMessage = await getFrameMessage(previousFrame.postBody, {
    hubHttpUrl: DEFAULT_DEBUGGER_HUB_URL,
  });
  console.log(frameMessage?.inputText);

  // if (frameMessage?.transactionId) {
  //   return (
  //     <FrameContainer
  //       pathname="/examples/transaction"
  //       postUrl="/examples/transaction/frames"
  //       state={state}
  //       previousFrame={previousFrame}
  //     >
  //       <FrameImage aspectRatio="1:1">
  //         <div tw="bg-purple-800 text-white w-full h-full justify-center items-center flex">
  //           Transaction submitted! {frameMessage.transactionId}
  //         </div>
  //       </FrameImage>
  //       <FrameInput text="put some text here" />
  //       <FrameButton action="link" target={`https://optimistic.etherscan.io/tx/${frameMessage.transactionId}`}>
  //         View on block explorer
  //       </FrameButton>
  //     </FrameContainer>
  //   );
  // }

  // then, when done, return next frame
  const reducer = (state: any, action: any) => ({ messages: [...state.messages, frameMessage?.inputText] });
  const [state, dispatch] = useFramesReducer(reducer, { messages: [] }, previousFrame);
  console.log(state);

  return (
    <div>
      Rent farcaster storage example <Link href={createDebugUrl(url)}>Debug</Link>
      <FrameContainer pathname="/" postUrl="/frames" state={state} previousFrame={previousFrame}>
        <FrameImage aspectRatio="1:1">
          <div tw="bg-purple-800 text-white w-full h-full justify-center items-center">Rent farcaster storage</div>
        </FrameImage>
        <FrameInput text="put some text here" />
        <FrameButton onClick={dispatch}>Test</FrameButton>
      </FrameContainer>
    </div>
  );
}
