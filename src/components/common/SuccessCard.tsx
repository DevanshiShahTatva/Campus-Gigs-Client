import React from "react";
import { Card, CardContent } from "../ui/card";
import IconMap from "./IconMap";
import { Button } from "./ui/Button";

interface Props {
  successTitle: string;
  successPara: string;
  onClickButton: () => void;
}

const SuccessCard = (props: Props) => {
  const { successTitle, successPara, onClickButton } = props;
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center">
        <IconMap name="submitted" />
        <h3 className="text-2xl font-bold mb-2 mt-4 text-[var(--text-dark)]">
          {successTitle}
        </h3>
        <p className="text-[var(--text-semi-dark)] mb-6">{successPara}</p>
        <Button onClick={onClickButton}>Create more gig</Button>
      </CardContent>
    </Card>
  );
};

export default SuccessCard;
