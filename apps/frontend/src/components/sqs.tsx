import { useQuery } from '@apollo/client';
import { LIST_SQS } from '../graphql/queries';

export function SQSList() {
    const { loading, error, data } = useQuery(LIST_SQS);

    if (loading) return <p className="text-blue-500">Loading...</p>;
    if (error) return <p className="text-red-500">Error: {error.message}</p>;

    return (
        <div className="p-4">
        <h2 className="text-xl font-bold mb-2">S3 Buckets</h2>
    <ul className="list-disc pl-5">
        {data.sqsQueues.map((queue: any) => (
                <li key={queue.url}>
                    <strong>{queue.url}</strong>
                    </li>
            ))}
        </ul>
        </div>
);
}
