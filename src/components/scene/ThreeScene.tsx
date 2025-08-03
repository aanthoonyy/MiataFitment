import { RefObject } from "react";

type Props = {
  containerRef: RefObject<HTMLDivElement>;
};

export default function ThreeScene({ containerRef }: Props) {
  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        position: "absolute",
        top: 0,
        left: 0,
      }}
    />
  );
}
