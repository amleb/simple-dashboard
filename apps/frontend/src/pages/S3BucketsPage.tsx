import React, { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";

const GET_S3_BUCKETS = gql`
  query GetS3Buckets {
    s3Buckets {
      name
      region
    }
  }
`;

const S3BucketsPage: React.FC = () => {
    const { data, loading, error } = useQuery(GET_S3_BUCKETS);
    const [buckets, setBuckets] = useState<any[]>([]);

    useEffect(() => {
        if (data) {
            setBuckets(data.s3Buckets);
        }
    }, [data]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading S3 buckets</div>;

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold">S3 Buckets</h2>
            <ul className="mt-4">
                {buckets.map((bucket) => (
                    <li key={bucket.name} className="py-2">
                        <strong>{bucket.name}</strong> - {bucket.region}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default S3BucketsPage;
