/* global URLSearchParams */
import React, {useState, useCallback} from "react";
import {Link, useNavigate, useLocation, useSearchParams} from "react-router-dom";
import useSearchParam from "../useSearchParam";

import Button from 'react-bootstrap/Button';
import BackgroundImage1 from '../resources/Photo Africa Coast Original.jpg'
import OIHLogo from "../resources/Logo Nav x 2.png";

import { PROMOTED_REGIONS, randomSampleQueries } from '../constants';

// Set once, will change for every load, not every key click
const currentSampleQueries = randomSampleQueries(4);

export default function Search() {
    const navigate = useNavigate();
    const [params,] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(params.has('search_text') ? params.get('search_text') : '');
    const [region, setRegion] = useSearchParam("region", "global");
    const location = useLocation();
    const isResults = location.pathname.startsWith("/results");

    const [_, url, tabName=''] = window.location.pathname.split('/');

    const hrefFor = (region, query) => `/results/${tabName}?${new URLSearchParams({
        ...query ? {search_text: query} : {},
        ...region && region.toUpperCase() !== "GLOBAL" ? {region} : {}
    })}`;

    const handleSubmit = useCallback(() =>
                                   navigate(hrefFor(region, searchQuery)),
                                   [navigate, region, searchQuery, tabName]);

    const placeholder = useCallback(() =>
                                    "Search across our " + (PROMOTED_REGIONS[region]||'Global') + " partners"
                                    , [region]);

    return (
      <div className={"search__container " + (url == " results" ? ' searchbg-alt' : '')}>
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-2 col-sm-12 me-4 mb-4">
              <Link
                to='/'
                onClick= {e=>setSearchQuery('')}
              >
                <img className="p-1" height="100px" src={OIHLogo}/>
              </Link>
            </div>
            <div className="col-12 col-md-9 col-sm-11">
              <form
                id='searchBarForm'
                className={"d-flex flex-justify-start align-self pt-2" + (url == "results" ? 'result-search' : '')}
                onSubmit={e => {
                  e.preventDefault();
                  handleSubmit();
                }}>
                <select className="form-select w-50 rounded-0"
                        value={region}
                        onChange={e => setRegion(e.target.value)}>
                  {
                      Object.entries(PROMOTED_REGIONS).map(([region, title]) => {
                        return <option
                                 key={region}
                                 value={region}
                               >
                                 {title}
                               </option>;
                    })
                  }
                </select>
                <input
                  className="flex-fill form-control rounded-0"
                  type="text"
                  placeholder={placeholder()}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  name="search"/>
                <Button className="btn-lg btn-info rounded-0 text-dark" type="submit"><span className="h6">Search</span></Button>
              </form>
              {!isResults && (
                <div className="text-light text-start mt-3">
                  <span className="p-2 h5">TRY:</span>
                  {currentSampleQueries.map((query,ix)=>(
                    <Link
                      key={ix}
                      // Touch up the internal state to match the navigation
                      onClick= {e=>setSearchQuery(query)}
                      // do the navigation
                      to={ hrefFor(region, query) }
                      className="text-info text-light h6 p-2"
                    >
                      {query}
                    </Link>
                  ))
                  }
                </div>)}
              {!isResults && (
                  <div className="text-light text-end ">
                    <a href='#bbc' className='text-light'>Browse by Category</a>
                  </div>)}
            </div>
          </div>
        </div>
      </div>
    );
}
