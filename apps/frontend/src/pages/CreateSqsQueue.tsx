import { useForm } from "@refinedev/react-hook-form";
import { useNavigate } from "react-router-dom";
import { useRegion } from '../contexts/RegionContext';
import { graphqlDataProvider } from '../lib/dataProvider';
import { createUrqlClient } from '../lib/urqlClient';
import { FieldValues } from "react-hook-form";


export const CreateSqsQueue = () => {
    const {
        register,
        handleSubmit,
    } = useForm();
    const navigate = useNavigate();
    const {region, } = useRegion();
    const client = createUrqlClient(region);

    const onSubmit = async (data: FieldValues) => {
        try {
            const provider = graphqlDataProvider(client);
            await provider.create({ resource: "sqsQueues", variables: { name: data.name }, meta: { region } });

            navigate("/sqs-queues");
        } catch (err: any) {
            console.error("Create error:", err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
            <h2 className="text-xl font-bold">Create SQS Queue</h2>
            <input
                {...register("name", { required: true })}
                placeholder="Queue name"
                className="border p-2 w-full"
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                Create
            </button>
        </form>
    );
};
