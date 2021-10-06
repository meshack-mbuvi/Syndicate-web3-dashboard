import React, { FC } from "react";
import { Modal, ModalStyle } from "src/components/modal";
import { useSelector, useDispatch } from "react-redux";
import { hideTwitterModal } from "@/redux/actions";
import { RootState } from "@/redux/store";
import SignInButton from "../signIn/SignInButton";

const ConnectTwitter: FC = () => {
  const dispatch = useDispatch();

  const {
    web3Reducer: { showTwitterModal },
  } = useSelector((state: RootState) => state);

  return (
    <Modal
      title="Sign in to Syndicate"
      show={showTwitterModal}
      modalStyle={ModalStyle.DARK}
      closeModal={() => dispatch(hideTwitterModal())}
    >
      <div className="top-1/2 left-1/2">
        <div className="">
          <p className="leading-6 py-4">
            Follow syndicates, manage your profile, and more by signing in with
            your Twitter account. We never link your account to your wallet.
          </p>
          <div className="flex">
            <span className="text-blue-navy pr-1">
              Learn more about how we keep your data secure
            </span>
            <img src="/images/chevron-left-blue.svg" alt="" />
          </div>
          <SignInButton />
        </div>
      </div>
    </Modal>
  );
};

export default ConnectTwitter;
