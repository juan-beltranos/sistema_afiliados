"use client";

import React, { useState } from "react";
import axios from "axios";

import SwitcherThree from "@/components/Switchers/SwitcherThree";
import SelectGroup from "@/components/SelectGroup/SelectGroup";
import { languageOptions } from "@/options";

const initialFormState = {
  width: 0,
  height: 0,
  theme: "",
  amountWords: 0,
  amountWordSoup: 0,
  language: "",
  publishAmazon: false
};

const FormLayout = () => {
  const [formState, setFormState] = useState(initialFormState);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: e.target.type === "number" ? Number(value) : value
    });
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormState({ ...formState, publishAmazon: checked });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('http://localhost:3000/api/wordsoup', formState);
      console.log(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-9">
      <div className="flex flex-col gap-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <form onSubmit={handleSubmit}>
            <div className="p-6.5">
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Theme of the WordSoup
                  </label>
                  <input
                    type="text"
                    name="theme"
                    value={formState.theme}
                    onChange={handleChange}
                    placeholder="Enter your Theme for coloring book"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="w-full xl:w-1/2">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Number of the WordSoup
                  </label>
                  <input
                    type="number"
                    name="amountWordSoup"
                    value={formState.amountWordSoup}
                    onChange={handleChange}
                    placeholder="Enter number of WordSoup"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>

              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Width of the WordSoup
                  </label>
                  <input
                    type="number"
                    name="width"
                    value={formState.width}
                    onChange={handleChange}
                    placeholder="Enter width of the WordSoup"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="w-full xl:w-1/2">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Height of the WordSoup
                  </label>
                  <input
                    type="number"
                    name="height"
                    value={formState.height}
                    onChange={handleChange}
                    placeholder="Enter height of the WordSoup"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>

              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Amount of words
                  </label>
                  <input
                    type="number"
                    name="amountWords"
                    value={formState.amountWords}
                    onChange={handleChange}
                    placeholder="Enter amount of words"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                <div className="w-full xl:w-1/2">
                  <SelectGroup
                    label="Language"
                    name="language"
                    options={languageOptions}
                    placeholder="Select Language"
                    value={formState.language}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    ¿Publish on Amazon KDP?
                  </label>
                  <SwitcherThree
                    checked={formState.publishAmazon}
                    onChange={handleSwitchChange}
                  />
                </div>
              </div>

              <div className="flex justify-center mt-8">
                <button
                  type="submit"
                  className={`bg-primary text-white px-8 py-3 rounded-md transition duration-300 ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-primary-dark"
                    }`}
                  disabled={loading}
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5 mr-3 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V2.5a.5.5 0 00-1 0V4a1 1 0 01-1 1H4.5a.5.5 0 000 1H5a2 2 0 00-2 2v3.5a.5.5 0 001 0V9a1 1 0 011-1h2.5a.5.5 0 000-1H5a2 2 0 00-2 2v3.5a.5.5 0 001 0V15a1 1 0 011-1h7.5a.5.5 0 000-1H8a2 2 0 00-2 2v3.5a.5.5 0 001 0V19a1 1 0 011-1h5.5a.5.5 0 000-1H10a2 2 0 00-2 2v1.5a.5.5 0 001 0V21a1 1 0 011-1h3.5a.5.5 0 000-1H12a8 8 0 01-8-8z"></path>
                    </svg>
                  ) : (
                    "Generate WordSoup"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormLayout;
