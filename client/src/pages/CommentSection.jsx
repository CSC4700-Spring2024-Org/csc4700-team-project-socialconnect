// components/CommentSection.js
import React from 'react';
import '../Styles/Dashboard.css';
import { useSelector } from 'react-redux';
import Spinner from '../components/Spinner';

const CommentSection = () => {
    // Sample list of comments with user, platform, and comment information
    const { comments, isLoadingInsta, isSuccessInsta } = useSelector((state) => state.insta)

    if (isLoadingInsta || !comments) {
      return <Spinner />
    }

    return (
      <section class="bg-white dark:bg-gray-900 py-8 lg:py-16 antialiased">
        <div class="max-w-2xl mx-auto px-4">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">{comments.length}</h2>
          </div>
        {comments.map((comment) => {
              <article class="p-6 text-base bg-white rounded-lg dark:bg-gray-900">
              <footer class="flex justify-between items-center mb-2">
                  <div class="flex items-center">
                  <p class="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
                    {comment.username}
                  </p>
                      <p class="text-sm text-gray-600 dark:text-gray-400"><time pubdate>{comment.timestamp}</time></p>
                  </div>
              </footer>
              <p className="text-gray-500 dark:text-gray-400">{comment.text}</p>
          </article>
          {comment.replies ? comment.replies.data.map((reply) => {
            <article className="p-6 mb-3 ml-6 lg:ml-12 text-base bg-white rounded-lg dark:bg-gray-900">
              <footer class="flex justify-between items-center mb-2">
                  <div class="flex items-center">
                  <p class="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
                    {reply.username}
                  </p>
                      <p class="text-sm text-gray-600 dark:text-gray-400"><time pubdate dateTime="2022-02-12"
                              title="February 12th, 2022">{reply.timestamp}</time></p>
                  </div>
              </footer>
              <p class="text-gray-500 dark:text-gray-400">{reply.text}</p>
          </article>
          }):<></>}
        })}
      </div>
    </section>
    );
  };
  
  export default CommentSection;