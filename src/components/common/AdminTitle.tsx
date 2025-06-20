
const AdminTitle = ({title}:{title: string}) => {
  return (
    <div className="mb-6 flex w-full justify-between">
      <p className="text-2xl font-bold text-[var(--text-dark)]">{title}</p>
    </div>
  );
};

export default AdminTitle;
