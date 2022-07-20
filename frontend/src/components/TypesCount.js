import React, {useEffect, useState} from "react";
import {Col, Container, Row} from "react-bootstrap";

import { dataServiceUrl } from '../config/environment';
import {useNavigate} from "react-router-dom";
import useSearchParam from "../useSearchParam";
import regionBoundsMap  from '../constants'
const doc_types = ['CreativeWork', 'Person', 'Organization', 'Dataset', 'ResearchProject', 'Event', 'Course', 'Vehicle']
const defaultCountState = {'counts': Object.fromEntries(doc_types.map(e => [e, 0]))}

const entries = counts => [
    [
        {
            id: 'Experts',
            count: (counts['Person'] || 0) + (counts['Organization'] || 0),
            text: 'Experts'
        },
        {
            id: 'CreativeWork',
            text: 'Documents'
        },
        {
            id: 'Course',
            text: 'Training'
        }
    ],
    [
        {
            id: 'Vehicle',
            text: 'Vessels'
        },
        {
            id: 'ResearchProject',
            text: 'Projects'
        },
        {
            id: 'SpatialData',
            count: 0,
            text: 'Spatial Data & Maps'
        }
    ]
];

export default function TypesCount() {
    const [counts, setCounts] = useState(defaultCountState);
    const [spatialData, setSpatialData] = useState(0);
    const navigate = useNavigate();
    const [region,] = useSearchParam("region")

    const get_region_bounds = () => {
        let bounds;
        if (region){
            bounds = regionBoundsMap[region.replaceAll(' ', '_')]
        }
        if (bounds) return bounds
        else return '[-90,-180 TO 90,180]'
    }

    useEffect(() => {
        fetch(`${dataServiceUrl}/count?field=type${region ? '&region=' + region : ''}`)
            .then(response => response.json())
            .then(json => setCounts(json))

        fetch(`${dataServiceUrl}/search?facetType=the_geom&facetName=${get_region_bounds()}${region ? '&region=' + region : ''}`)
            .then(response => response.json())
            .then(json => setSpatialData(Object.values(json.counts).reduce((x, y) => x + y, 0)))

    }, [region]);

    const searchByType = type => event => navigate(`/results/${type}?${region ? 'region=' + region : ''}`);

    return (
        <Container className="spacer">
            <Row>
                {entries(counts.counts).map(row =>
                    <Row className="pb-3 mb-2">
                        {row.map(col =>
                            <Col className="primary-bg rounded-circle h-100 bubble" role="button" id={`bubble_${col.id}`} onClick={searchByType(col.id)}>
                                <p className="text-light-blue-alt">
                                    {
                                        col.id !== 'SpatialData' ? counts.counts[col.id] || 0 : spatialData
                                    }
                                </p>
                                <p className="text-light fw-bold text-uppercase">{col.text ?? col.id}</p>
                            </Col>
                        )}
                    </Row>
                )}
            </Row>
        </Container>
    )
}
