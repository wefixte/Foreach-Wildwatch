import React from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ObservationModal } from '../../components/ObservationModal';

export default function ObservationPage() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const latitude = params.latitude ? parseFloat(params.latitude as string) : undefined;
    const longitude = params.longitude ? parseFloat(params.longitude as string) : undefined;
    const observationId = params.id as string;

    const handleClose = () => {
        router.back();
    };

    return (
        <ObservationModal
            latitude={latitude}
            longitude={longitude}
            observationId={observationId}
            onClose={handleClose}
        />
    );
}