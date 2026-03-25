import type { MDXComponents } from 'mdx/types';

export const mdxComponents: MDXComponents = {
  h1: (props) => <h1 className="text-3xl font-bold text-white mt-12 mb-6" {...props} />,
  h2: (props) => <h2 className="text-2xl font-semibold text-white mt-10 mb-4 pb-2 border-b border-white/10" {...props} />,
  h3: (props) => <h3 className="text-xl font-medium text-slate-200 mt-8 mb-3" {...props} />,
  h4: (props) => <h4 className="text-lg font-medium text-slate-300 mt-6 mb-2" {...props} />,
  p: (props) => <p className="text-slate-300 leading-relaxed mb-4" {...props} />,
  a: (props) => <a className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2" {...props} />,
  ul: (props) => <ul className="list-disc list-inside space-y-1 text-slate-300 mb-4 ml-4" {...props} />,
  ol: (props) => <ol className="list-decimal list-inside space-y-1 text-slate-300 mb-4 ml-4" {...props} />,
  li: (props) => <li className="text-slate-300 leading-relaxed" {...props} />,
  blockquote: (props) => (
    <blockquote className="border-l-4 border-indigo-500/50 bg-indigo-500/5 px-4 py-3 my-4 rounded-r-lg text-slate-300 [&>p]:mb-0" {...props} />
  ),
  code: ({ children, className, ...props }: React.ComponentProps<'code'>) => {
    if (className) {
      return <code className={`${className} text-sm`} {...props}>{children}</code>;
    }
    return <code className="bg-white/5 border border-white/10 rounded px-1.5 py-0.5 text-sm text-indigo-300 font-mono" {...props}>{children}</code>;
  },
  pre: (props) => (
    <pre className="bg-[#0d1117] border border-white/5 rounded-lg p-4 overflow-x-auto my-4 text-sm leading-relaxed" {...props} />
  ),
  table: (props) => (
    <div className="overflow-x-auto my-4">
      <table className="w-full text-sm text-left border-collapse" {...props} />
    </div>
  ),
  thead: (props) => <thead className="bg-indigo-500/10 text-slate-200" {...props} />,
  th: (props) => <th className="px-4 py-2 font-medium border border-white/10" {...props} />,
  td: (props) => <td className="px-4 py-2 text-slate-300 border border-white/10" {...props} />,
  tr: (props) => <tr className="even:bg-white/[0.02]" {...props} />,
  hr: () => <hr className="border-white/10 my-8" />,
  strong: (props) => <strong className="text-white font-semibold" {...props} />,
  em: (props) => <em className="text-slate-200" {...props} />,
};
