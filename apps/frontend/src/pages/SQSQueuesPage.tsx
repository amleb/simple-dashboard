import React, { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";

const GET_SQS_QUEUES = gql`
  query GetSQSQueues {
    sqsQueues {
      name
      region
    }
  }
`;

const SQSQueuesPage: React.FC = () => {
    const { data, loading, error } = useQuery(GET_SQS_QUEUES);
    const [queues, setQueues] = useState<any[]>([]);

    useEffect(() => {
        if (data) {
            setQueues(data.sqsQueues);
        }
    }, [data]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading SQS queues</div>;

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold">SQS Queues</h2>
            <ul className="mt-4">
                {queues.map((queue) => (
                    <li key={queue.name} className="py-2">
                        <strong>{queue.name}</strong> - {queue.region}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SQSQueuesPage;
