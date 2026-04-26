import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("next-mdx-remote/rsc", () => ({
  MDXRemote: ({ source }: { source: string }) => <div data-testid="mdx-out">{source}</div>,
}));

import { MdxContent } from "./mdx-content";

describe("MdxContent", () => {
  it("passes its source prop through to MDXRemote", () => {
    const { getByTestId } = render(<MdxContent source="# hello world" />);
    expect(getByTestId("mdx-out").textContent).toBe("# hello world");
  });
});
