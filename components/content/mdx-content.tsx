import { MDXRemote } from "next-mdx-remote/rsc";

type Props = {
  source: string;
};

export function MdxContent({ source }: Props) {
  return <MDXRemote source={source} />;
}
